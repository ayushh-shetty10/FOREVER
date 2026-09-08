require("dotenv").config();
const mongoose = require("mongoose");
const { productModel } = require("./src/models/productModel");
const { stockReservationModel } = require("./src/models/stockReservationModel");
const { orderModel } = require("./src/models/ordersModel");
const { reserveStock, releaseReservation, confirmReservation } = require("./src/services/inventoryService");
const { cleanupExpiredReservations } = require("./src/workers/reservationExpiryWorker");

const runIntegrationTests = async () => {
    try {
        console.log("Connecting to MongoDB for Phase 2.1D Integration Tests...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.\n");

        const testUserId = new mongoose.Types.ObjectId();

        const createDummyProduct = async (totalStock = 10) => {
            return await productModel.create({
                name: "Integration Test Saree " + Date.now() + "_" + Math.random(),
                description: "Test description",
                price: 2500,
                images: ["http://example.com/test.jpg"],
                category: "Silk Sarees",
                subCategory: "Kanjivaram",
                sizes: ["Free Size"],
                totalStock,
                reservedStock: 0,
                availableStock: totalStock,
                date: Date.now()
            });
        };

        console.log("==========================================");
        console.log("TEST 1: Background Expiry Worker Clean-up");
        console.log("==========================================");
        const p1 = await createDummyProduct(10);
        
        const expiredReservation = await stockReservationModel.create({
            userId: testUserId,
            orderId: new mongoose.Types.ObjectId(),
            items: [{ productId: p1._id, quantity: 4 }],
            status: "RESERVED",
            expiresAt: new Date(Date.now() - 5 * 60 * 1000) // 5 mins in past
        });
        
        await productModel.findByIdAndUpdate(p1._id, {
            $inc: { availableStock: -4, reservedStock: 4 }
        });

        const p1Reserved = await productModel.findById(p1._id);
        console.log("Before Expiry Run -> Available:", p1Reserved.availableStock, "Reserved:", p1Reserved.reservedStock);

        await cleanupExpiredReservations();

        const p1After = await productModel.findById(p1._id);
        const res1After = await stockReservationModel.findById(expiredReservation._id);

        console.log("After Expiry Run -> Available:", p1After.availableStock, "Reserved:", p1After.reservedStock);
        console.log("Reservation Status:", res1After.status);

        if (p1After.availableStock !== 10 || p1After.reservedStock !== 0 || res1After.status !== "RELEASED") {
            throw new Error("TEST 1 FAILED: Expiry worker did not restore stock or update status!");
        }
        console.log("✅ TEST 1 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 2: COD Order Lifecycle (Reserve -> Order -> Confirm)");
        console.log("==========================================");
        const p2 = await createDummyProduct(10);
        
        const res2 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p2._id, quantity: 3 }]
        });
        
        const order2 = await orderModel.create({
            userId: testUserId,
            items: [{ productId: p2._id, quantity: 3, name: p2.name, price: p2.price }],
            amount: 7500,
            address: { firstName: "Test", city: "Mumbai" },
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        });

        await stockReservationModel.findByIdAndUpdate(res2.reservation._id, { orderId: order2._id });
        const conf2 = await confirmReservation({ reservationId: res2.reservation._id, orderId: order2._id });

        const p2Final = await productModel.findById(p2._id);
        const res2Final = await stockReservationModel.findById(res2.reservation._id);

        console.log("Product 2 Final -> Total:", p2Final.totalStock, "Available:", p2Final.availableStock, "Reserved:", p2Final.reservedStock);
        console.log("Reservation 2 Status:", res2Final.status);

        if (!conf2.success || p2Final.totalStock !== 7 || p2Final.availableStock !== 7 || p2Final.reservedStock !== 0 || res2Final.status !== "CONFIRMED") {
            throw new Error("TEST 2 FAILED: COD Order confirmation state incorrect!");
        }
        console.log("✅ TEST 2 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 3: Payment Cancellation / Failure Release");
        console.log("==========================================");
        const p3 = await createDummyProduct(10);

        const res3 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p3._id, quantity: 2 }]
        });

        const order3 = await orderModel.create({
            userId: testUserId,
            items: [{ productId: p3._id, quantity: 2, name: p3.name, price: p3.price }],
            amount: 5000,
            address: { firstName: "Test", city: "Delhi" },
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        });

        await stockReservationModel.findByIdAndUpdate(res3.reservation._id, { orderId: order3._id });

        await releaseReservation({ orderId: order3._id });

        const p3Final = await productModel.findById(p3._id);
        const res3Final = await stockReservationModel.findById(res3.reservation._id);

        console.log("Product 3 Final -> Total:", p3Final.totalStock, "Available:", p3Final.availableStock, "Reserved:", p3Final.reservedStock);
        console.log("Reservation 3 Status:", res3Final.status);

        if (p3Final.availableStock !== 10 || p3Final.reservedStock !== 0 || res3Final.status !== "RELEASED") {
            throw new Error("TEST 3 FAILED: Payment failure release state incorrect!");
        }
        console.log("✅ TEST 3 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 4: Case 6 — Expired / RELEASED Reservation Cannot Be Confirmed Later");
        console.log("==========================================");
        const p4 = await createDummyProduct(10);
        const res4 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p4._id, quantity: 2 }]
        });

        // Expire / Release reservation
        await releaseReservation({ reservationId: res4.reservation._id });

        // Late payment callback arrives attempting to confirm
        const lateConfirm = await confirmReservation({ reservationId: res4.reservation._id });
        const p4Final = await productModel.findById(p4._id);

        console.log("Late Confirm Result -> Success:", lateConfirm.success, "| Message:", lateConfirm.message);
        console.log("Product 4 Stock -> Total:", p4Final.totalStock, "Available:", p4Final.availableStock, "Reserved:", p4Final.reservedStock);

        if (lateConfirm.success || p4Final.totalStock !== 10 || p4Final.availableStock !== 10 || p4Final.reservedStock !== 0) {
            throw new Error("TEST 4 FAILED: Late confirm mutated RELEASED reservation stock!");
        }
        console.log("✅ TEST 4 PASSED!\n");


        // Clean up test records
        await productModel.deleteMany({ name: { $regex: /^Integration Test Saree / } });
        await stockReservationModel.deleteMany({ userId: testUserId });
        await orderModel.deleteMany({ userId: testUserId });

        console.log("Cleaned up integration test records.");
        console.log("ALL PHASE 2.1D INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉");

    } catch (err) {
        console.error("Integration Test Execution Failed:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

runIntegrationTests();
