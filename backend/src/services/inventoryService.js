const mongoose = require("mongoose");
const { productModel } = require("../models/productModel");
const { stockReservationModel } = require("../models/stockReservationModel");

/**
 * Inventory Service
 * Handles atomic stock reservation, release, and confirmation operations.
 */

/**
 * Reserve stock for multiple items using All-or-Nothing atomic semantics.
 * 
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @param {string|mongoose.Types.ObjectId} [params.orderId]
 * @param {Array<{productId: string, quantity: number}>} params.items
 * @param {number} [params.expiryMinutes=15]
 */
const reserveStock = async ({ userId, orderId, items, expiryMinutes = 15 }) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return {
            success: false,
            message: "No items provided for reservation"
        };
    }

    // Standardize items and validate inputs
    const normalizedItems = [];
    for (const item of items) {
        const pId = item.productId || item._id || item.id;
        const qty = Number(item.quantity);

        if (!pId || !mongoose.Types.ObjectId.isValid(pId)) {
            return {
                success: false,
                message: `Invalid product ID: ${pId}`
            };
        }
        if (!Number.isInteger(qty) || qty <= 0) {
            return {
                success: false,
                message: `Invalid quantity for product ${pId}: must be a positive integer`
            };
        }
        normalizedItems.push({ productId: pId, quantity: qty });
    }

    // Ensure valid orderId reference
    const validOrderId = orderId && mongoose.Types.ObjectId.isValid(orderId)
        ? new mongoose.Types.ObjectId(orderId)
        : new mongoose.Types.ObjectId();

    const reservedSoFar = [];
    const stockIssues = [];

    // Attempt atomic reservation item by item
    for (const item of normalizedItems) {
        // Atomic check-and-decrement operation: availableStock >= quantity
        const updatedProduct = await productModel.findOneAndUpdate(
            {
                _id: item.productId,
                availableStock: { $gte: item.quantity }
            },
            {
                $inc: {
                    availableStock: -item.quantity,
                    reservedStock: item.quantity
                }
            },
            { new: true }
        );

        if (updatedProduct) {
            reservedSoFar.push(item);
        } else {
            // Failed: Insufficient stock or product not found
            const currentProd = await productModel.findById(item.productId);
            stockIssues.push({
                productId: item.productId,
                requestedQuantity: item.quantity,
                availableQuantity: currentProd ? currentProd.availableStock : 0
            });
            break; // Stop further reservations
        }
    }

    // All-or-Nothing Rollback if any item failed
    if (stockIssues.length > 0) {
        for (const item of reservedSoFar) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    availableStock: item.quantity,
                    reservedStock: -item.quantity
                }
            });
        }

        return {
            success: false,
            message: "Stock reservation failed due to insufficient stock",
            stockIssues
        };
    }

    // ALL items succeeded: Create StockReservation record
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const reservation = await stockReservationModel.create({
        userId,
        orderId: validOrderId,
        items: normalizedItems,
        status: "RESERVED",
        expiresAt
    });

    if(!reservation) {
        return {
            success:false,
            message:"Failed to create new reservation in db",
            
        }
    }

    return {
        success: true,
        message: "Stock reserved successfully",
        reservation
    };
};

/**
 * Release an active reservation (Idempotent).
 * Restores reservedStock -> availableStock.
 * 
 * @param {Object} params
 * @param {string} [params.reservationId]
 * @param {string} [params.orderId]
 * @param {string} [params.userId]
 */
const releaseReservation = async ({ reservationId, orderId, userId }) => {
    const query = {};
    if (reservationId && mongoose.Types.ObjectId.isValid(reservationId)) {
        query._id = reservationId;
    } else if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
        query.orderId = orderId;
    } else {
        return {
            success: false,
            message: "Reservation ID or Order ID is required"
        };
    }

    if (userId) {
        query.userId = userId;
    }

    // Atomically find and update status ONLY if currently RESERVED
    const reservation = await stockReservationModel.findOneAndUpdate(
        { ...query, status: "RESERVED" },
        { $set: { status: "RELEASED" } },
        { new: true }
    );

    if (!reservation) {
        const existing = await stockReservationModel.findOne(query);
        if (!existing) {
            return { success: false, message: "Reservation not found" };
        }
        if (existing.status === "RELEASED") {
            return {
                success: true,
                message: "Reservation is already released",
                reservation: existing
            };
        }
        return {
            success: false,
            message: `Cannot release reservation with status: ${existing.status}`
        };
    }

    // Restore stock for all items
    for (const item of reservation.items) {
        await productModel.findByIdAndUpdate(item.productId, {
            $inc: {
                reservedStock: -item.quantity,
                availableStock: item.quantity
            }
        });
    }

    return {
        success: true,
        message: "Reservation released successfully",
        reservation
    };
};

/**
 * Confirm a reservation (Idempotent).
 * Decrements reservedStock and totalStock; availableStock is unchanged.
 * 
 * @param {Object} params
 * @param {string} [params.reservationId]
 * @param {string} [params.orderId]
 * @param {string} [params.userId]
 */
const confirmReservation = async ({ reservationId, orderId, userId }) => {
    const query = {};
    if (reservationId && mongoose.Types.ObjectId.isValid(reservationId)) {
        query._id = reservationId;
    } else if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
        query.orderId = orderId;
    } else {
        return {
            success: false,
            message: "Reservation ID or Order ID is required"
        };
    }

    if (userId) {
        query.userId = userId;
    }

    // Atomically find and update status ONLY if currently RESERVED
    const reservation = await stockReservationModel.findOneAndUpdate(
        { ...query, status: "RESERVED" },
        { $set: { status: "CONFIRMED" } },
        { new: true }
    );

    if (!reservation) {
        const existing = await stockReservationModel.findOne(query);
        if (!existing) {
            return { success: false, message: "Reservation not found" };
        }
        if (existing.status === "CONFIRMED") {
            return {
                success: true,
                message: "Reservation is already confirmed",
                reservation: existing
            };
        }
        return {
            success: false,
            message: `Cannot confirm reservation with status: ${existing.status}`
        };
    }

    // Confirm inventory: reservedStock decreases, totalStock decreases, availableStock is unchanged
    for (const item of reservation.items) {
        await productModel.findByIdAndUpdate(item.productId, {
            $inc: {
                reservedStock: -item.quantity,
                totalStock: -item.quantity
            }
        });
    }

    return {
        success: true,
        message: "Reservation confirmed successfully",
        reservation
    };
};

module.exports = {
    reserveStock,
    releaseReservation,
    confirmReservation
};
