require("dotenv").config();
const mongoose = require("mongoose");
const { productModel } = require("./src/models/productModel");
const { stockReservationModel } = require("./src/models/stockReservationModel");
const { orderModel } = require("./src/models/ordersModel");
const { reserveStock, releaseReservation, confirmReservation } = require("./src/services/inventoryService");
const { cleanupExpiredReservations } = require("./src/workers/reservationExpiryWorker");

const runPhase21ETests = async () => {
    try {
        console.log("Connecting to MongoDB for Phase 2.1E Tests (REQUIRED_CHECK)...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.\n");

        const testUserId = new mongoose.Types.ObjectId();

        const createDummyProduct = async (totalStock = 10) => {
            return await productModel.create({
                name: "Phase 2.1E Test Saree " + Date.now() + "_" + Math.random(),
                description: "Test description",
                price: 3500,
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
        console.log("TEST 1: Normal Successful Payment (RESERVED -> CONFIRMED)");
        console.log("==========================================");
        const p1 = await createDummyProduct(10);
        const res1 = await reserveStock({ userId: testUserId, items: [{ productId: p1._id, quantity: 2 }] });
        const o1 = await orderModel.create({
            userId: testUserId,
            items: [{ productId: p1._id, quantity: 2 }],
            amount: 7000,
            address: { firstName: "Test", city: "Mumbai" },
            paymentMethod: "Stripe",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        });
        await stockReservationModel.findByIdAndUpdate(res1.reservation._id, { orderId: o1._id });

        const confirm1 = await confirmReservation({ orderId: o1._id });
        if (confirm1.success) {
            await orderModel.findByIdAndUpdate(o1._id, { payment: true });
        }

        const p1After = await productModel.findById(p1._id);
        const res1After = await stockReservationModel.findById(res1.reservation._id);
        const o1After = await orderModel.findById(o1._id);

        console.log("Order 1 Payment:", o1After.payment, "| Status:", o1After.status);
        console.log("Reservation 1 Status:", res1After.status);
        console.log("Product 1 Stock -> Total:", p1After.totalStock, "Available:", p1After.availableStock, "Reserved:", p1After.reservedStock);

        if (res1After.status !== "CONFIRMED" || !o1After.payment || p1After.totalStock !== 8 || p1After.availableStock !== 8) {
            throw new Error("TEST 1 FAILED: Normal payment confirmation state incorrect!");
        }
        console.log("✅ TEST 1 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 2: Reservation Expiration Worker (RESERVED -> RELEASED)");
        console.log("==========================================");
        const p2 = await createDummyProduct(10);
        const expiredReservation = await stockReservationModel.create({
            userId: testUserId,
            orderId: new mongoose.Types.ObjectId(),
            items: [{ productId: p2._id, quantity: 3 }],
            status: "RESERVED",
            expiresAt: new Date(Date.now() - 5 * 60 * 1000) // 5 mins in past
        });
        await productModel.findByIdAndUpdate(p2._id, { $inc: { availableStock: -3, reservedStock: 3 } });

        await cleanupExpiredReservations();

        const p2After = await productModel.findById(p2._id);
        const res2After = await stockReservationModel.findById(expiredReservation._id);

        console.log("Product 2 Stock -> Available:", p2After.availableStock, "Reserved:", p2After.reservedStock);
        console.log("Reservation 2 Status:", res2After.status);

        if (res2After.status !== "RELEASED" || p2After.availableStock !== 10 || p2After.reservedStock !== 0) {
            throw new Error("TEST 2 FAILED: Expiration worker failed to release stock!");
        }
        console.log("✅ TEST 2 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 3: Late Payment Success After Expiry -> REQUIRED_CHECK");
        console.log("==========================================");
        const p3 = await createDummyProduct(10);
        const res3 = await reserveStock({ userId: testUserId, items: [{ productId: p3._id, quantity: 4 }] });
        const o3 = await orderModel.create({
            userId: testUserId,
            items: [{ productId: p3._id, quantity: 4 }],
            amount: 14000,
            address: { firstName: "Test", city: "Delhi" },
            paymentMethod: "Stripe",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        });
        await stockReservationModel.findByIdAndUpdate(res3.reservation._id, { orderId: o3._id });

        // Expire / release reservation
        await releaseReservation({ reservationId: res3.reservation._id });

        // Late payment callback arrives
        const lateConfirm = await confirmReservation({ orderId: o3._id });
        if (!lateConfirm.success) {
            // Confirmation failed because reservation is RELEASED -> Set REQUIRED_CHECK, payment = true
            await orderModel.findByIdAndUpdate(o3._id, { payment: true, status: "REQUIRED_CHECK" });
        }

        const o3After = await orderModel.findById(o3._id);
        const p3After = await productModel.findById(p3._id);
        const res3After = await stockReservationModel.findById(res3.reservation._id);

        console.log("Late Confirm Success:", lateConfirm.success, "| Reason:", lateConfirm.message);
        console.log("Order 3 Payment:", o3After.payment, "| Status:", o3After.status);
        console.log("Product 3 Stock -> Total:", p3After.totalStock, "Available:", p3After.availableStock, "Reserved:", p3After.reservedStock);

        if (lateConfirm.success || o3After.status !== "REQUIRED_CHECK" || !o3After.payment || p3After.totalStock !== 10 || p3After.availableStock !== 10) {
            throw new Error("TEST 3 FAILED: Late payment did not set REQUIRED_CHECK or mutated stock!");
        }
        console.log("✅ TEST 3 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 4: REQUIRED_CHECK Does NOT Mutate Inventory");
        console.log("==========================================");
        const stockBeforeT4 = await productModel.findById(p3._id);
        
        // Attempt confirmation again on already REQUIRED_CHECK order
        const reConfirmT4 = await confirmReservation({ orderId: o3._id });
        const stockAfterT4 = await productModel.findById(p3._id);

        console.log("Re-confirm Success:", reConfirmT4.success);
        console.log("Stock Before -> Total:", stockBeforeT4.totalStock, "Available:", stockBeforeT4.availableStock);
        console.log("Stock After  -> Total:", stockAfterT4.totalStock, "Available:", stockAfterT4.availableStock);

        if (stockBeforeT4.totalStock !== stockAfterT4.totalStock || stockBeforeT4.availableStock !== stockAfterT4.availableStock) {
            throw new Error("TEST 4 FAILED: Inventory mutated on REQUIRED_CHECK re-attempt!");
        }
        console.log("✅ TEST 4 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 5: Duplicate Successful Callback After REQUIRED_CHECK");
        console.log("==========================================");
        // Simulate a second payment success callback for order 3
        const o3Current = await orderModel.findById(o3._id);
        if (o3Current.payment && o3Current.status === "REQUIRED_CHECK") {
            const reConfirm2 = await confirmReservation({ orderId: o3._id });
            if (!reConfirm2.success) {
                // Remains REQUIRED_CHECK, payment = true
                await orderModel.findByIdAndUpdate(o3._id, { payment: true, status: "REQUIRED_CHECK" });
            }
        }
        const o3AfterDup = await orderModel.findById(o3._id);
        const p3AfterDup = await productModel.findById(p3._id);

        console.log("Order Status After Duplicate Callback:", o3AfterDup.status);
        console.log("Product 3 Stock Total:", p3AfterDup.totalStock, "Available:", p3AfterDup.availableStock);

        if (o3AfterDup.status !== "REQUIRED_CHECK" || p3AfterDup.totalStock !== 10 || p3AfterDup.availableStock !== 10) {
            throw new Error("TEST 5 FAILED: Duplicate callback altered state or mutated inventory!");
        }
        console.log("✅ TEST 5 PASSED!\n");


        console.log("==========================================");
        console.log("TEST 6: Normal Payment Failure (Order Failed, Reservation RELEASED)");
        console.log("==========================================");
        const p6 = await createDummyProduct(10);
        const res6 = await reserveStock({ userId: testUserId, items: [{ productId: p6._id, quantity: 2 }] });
        const o6 = await orderModel.create({
            userId: testUserId,
            items: [{ productId: p6._id, quantity: 2 }],
            amount: 7000,
            address: { firstName: "Test", city: "Kolkata" },
            paymentMethod: "Razorpay",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        });
        await stockReservationModel.findByIdAndUpdate(res6.reservation._id, { orderId: o6._id });

        // Simulate payment failure
        await orderModel.findByIdAndUpdate(o6._id, { status: "Failed" });
        await releaseReservation({ orderId: o6._id });

        const o6After = await orderModel.findById(o6._id);
        const p6After = await productModel.findById(p6._id);
        const res6After = await stockReservationModel.findById(res6.reservation._id);

        console.log("Order 6 Status:", o6After.status, "| Reservation Status:", res6After.status);
        console.log("Product 6 Stock -> Available:", p6After.availableStock, "Reserved:", p6After.reservedStock);

        if (o6After.status !== "Failed" || res6After.status !== "RELEASED" || p6After.availableStock !== 10) {
            throw new Error("TEST 6 FAILED: Normal payment failure state incorrect!");
        }
        console.log("✅ TEST 6 PASSED!\n");


        // Clean up test records
        await productModel.deleteMany({ name: { $regex: /^Phase 2.1E Test Saree / } });
        await stockReservationModel.deleteMany({ userId: testUserId });
        await orderModel.deleteMany({ userId: testUserId });

        console.log("Cleaned up Phase 2.1E test records.");
        console.log("ALL PHASE 2.1E RECONCILIATION TESTS PASSED SUCCESSFULLY! 🎉");

    } catch (err) {
        console.error("Phase 2.1E Test Execution Failed:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

runPhase21ETests();
