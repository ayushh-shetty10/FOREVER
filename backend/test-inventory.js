require("dotenv").config();
const mongoose = require("mongoose");
const { productModel } = require("./src/models/productModel");
const { stockReservationModel } = require("./src/models/stockReservationModel");
const { reserveStock, releaseReservation, confirmReservation } = require("./src/services/inventoryService");

const runTests = async () => {
    try {
        console.log("Connecting to MongoDB for Inventory Unit Tests...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.\n");

        const testUserId = new mongoose.Types.ObjectId();

        // Helper to create a dummy test product
        const createDummyProduct = async (totalStock = 10) => {
            return await productModel.create({
                name: "Test Saree " + Date.now() + "_" + Math.random(),
                description: "Test description",
                price: 1000,
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
        console.log("RUNNING TEST 1: Successful Reservation");
        console.log("==========================================");
        const p1 = await createDummyProduct(10);
        const res1 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p1._id, quantity: 3 }]
        });
        const p1Updated = await productModel.findById(p1._id);
        console.log("Result 1 Success:", res1.success);
        console.log("Product 1 Stock -> Total:", p1Updated.totalStock, "Available:", p1Updated.availableStock, "Reserved:", p1Updated.reservedStock);
        if (!res1.success || p1Updated.availableStock !== 7 || p1Updated.reservedStock !== 3) {
            throw new Error("Test 1 Failed!");
        }
        console.log("✅ TEST 1 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 2: Insufficient Stock");
        console.log("==========================================");
        const p2 = await createDummyProduct(2);
        const res2 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p2._id, quantity: 5 }]
        });
        const p2Updated = await productModel.findById(p2._id);
        console.log("Result 2 Success:", res2.success, "| Message:", res2.message);
        console.log("Product 2 Stock -> Total:", p2Updated.totalStock, "Available:", p2Updated.availableStock, "Reserved:", p2Updated.reservedStock);
        if (res2.success || p2Updated.availableStock !== 2 || p2Updated.reservedStock !== 0) {
            throw new Error("Test 2 Failed!");
        }
        console.log("✅ TEST 2 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 3: All-or-Nothing (Multi-Item Failure)");
        console.log("==========================================");
        const p3A = await createDummyProduct(5);
        const p3B = await createDummyProduct(1);
        const p3C = await createDummyProduct(10);
        const res3 = await reserveStock({
            userId: testUserId,
            items: [
                { productId: p3A._id, quantity: 2 },
                { productId: p3B._id, quantity: 4 }, // Fails!
                { productId: p3C._id, quantity: 1 }
            ]
        });
        const p3AUpdated = await productModel.findById(p3A._id);
        const p3BUpdated = await productModel.findById(p3B._id);
        const p3CUpdated = await productModel.findById(p3C._id);
        console.log("Result 3 Success:", res3.success, "| Issues:", JSON.stringify(res3.stockIssues));
        console.log("Item A Stock (Expected 5/0): Available =", p3AUpdated.availableStock, "Reserved =", p3AUpdated.reservedStock);
        console.log("Item B Stock (Expected 1/0): Available =", p3BUpdated.availableStock, "Reserved =", p3BUpdated.reservedStock);
        console.log("Item C Stock (Expected 10/0): Available =", p3CUpdated.availableStock, "Reserved =", p3CUpdated.reservedStock);
        if (res3.success || p3AUpdated.availableStock !== 5 || p3CUpdated.availableStock !== 10) {
            throw new Error("Test 3 Failed: All-or-nothing rollback incomplete!");
        }
        console.log("✅ TEST 3 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 4: Release Reservation");
        console.log("==========================================");
        const p4 = await createDummyProduct(10);
        const res4 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p4._id, quantity: 3 }]
        });
        const rel4 = await releaseReservation({ reservationId: res4.reservation._id });
        const p4Updated = await productModel.findById(p4._id);
        console.log("Release Success:", rel4.success);
        console.log("Product 4 Stock (Expected 10/0): Available =", p4Updated.availableStock, "Reserved =", p4Updated.reservedStock);
        if (!rel4.success || p4Updated.availableStock !== 10 || p4Updated.reservedStock !== 0) {
            throw new Error("Test 4 Failed!");
        }
        console.log("✅ TEST 4 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 5: Confirm Reservation");
        console.log("==========================================");
        const p5 = await createDummyProduct(10);
        const res5 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p5._id, quantity: 3 }]
        });
        const conf5 = await confirmReservation({ reservationId: res5.reservation._id });
        const p5Updated = await productModel.findById(p5._id);
        console.log("Confirm Success:", conf5.success);
        console.log("Product 5 Stock (Expected Total=7, Available=7, Reserved=0): Total =", p5Updated.totalStock, "Available =", p5Updated.availableStock, "Reserved =", p5Updated.reservedStock);
        if (!conf5.success || p5Updated.totalStock !== 7 || p5Updated.availableStock !== 7 || p5Updated.reservedStock !== 0) {
            throw new Error("Test 5 Failed!");
        }
        console.log("✅ TEST 5 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 6: Double Release (Idempotency)");
        console.log("==========================================");
        const p6 = await createDummyProduct(10);
        const res6 = await reserveStock({
            userId: testUserId,
            items: [{ productId: p6._id, quantity: 3 }]
        });
        await releaseReservation({ reservationId: res6.reservation._id });
        const rel6Second = await releaseReservation({ reservationId: res6.reservation._id });
        const p6Updated = await productModel.findById(p6._id);
        console.log("Second Release Success/Message:", rel6Second.success, "|", rel6Second.message);
        console.log("Product 6 Stock (Expected 10/0): Available =", p6Updated.availableStock, "Reserved =", p6Updated.reservedStock);
        if (p6Updated.availableStock !== 10 || p6Updated.reservedStock !== 0) {
            throw new Error("Test 6 Failed: Double release restored inventory twice!");
        }
        console.log("✅ TEST 6 PASSED!\n");

        console.log("==========================================");
        console.log("RUNNING TEST 7: Concurrent Reservation (Race Condition Check)");
        console.log("==========================================");
        const p7 = await createDummyProduct(1); // Only 1 available unit!
        const reqA = reserveStock({ userId: testUserId, items: [{ productId: p7._id, quantity: 1 }] });
        const reqB = reserveStock({ userId: testUserId, items: [{ productId: p7._id, quantity: 1 }] });
        
        const [resA, resB] = await Promise.all([reqA, reqB]);
        const p7Updated = await productModel.findById(p7._id);
        console.log("Concurrent Request A Success:", resA.success);
        console.log("Concurrent Request B Success:", resB.success);
        console.log("Product 7 Final Stock -> Total:", p7Updated.totalStock, "Available:", p7Updated.availableStock, "Reserved:", p7Updated.reservedStock);
        
        const successCount = (resA.success ? 1 : 0) + (resB.success ? 1 : 0);
        if (successCount !== 1 || p7Updated.availableStock !== 0 || p7Updated.reservedStock !== 1) {
            throw new Error(`Test 7 Failed! Success count: ${successCount}, Available: ${p7Updated.availableStock}`);
        }
        console.log("✅ TEST 7 PASSED! Exactly 1 succeeded, availableStock never negative!\n");

        // Clean up test products and reservations created during testing
        await productModel.deleteMany({ name: { $regex: /^Test Saree / } });
        await stockReservationModel.deleteMany({ userId: testUserId });
        console.log("Cleaned up test data.");
        console.log("ALL 7 INVENTORY TESTS COMPLETED SUCCESSFULLY! 🎉");

    } catch (err) {
        console.error("Test execution failed:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

runTests();
