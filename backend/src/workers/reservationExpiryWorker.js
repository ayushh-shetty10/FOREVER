const { stockReservationModel } = require("../models/stockReservationModel");
const { releaseReservation } = require("../services/inventoryService");

let workerIntervalId = null;

/**
 * Periodically checks for expired RESERVED stock reservations and releases them safely.
 */
const cleanupExpiredReservations = async () => {
    try {
        const now = new Date();
        // Query expired RESERVED reservations with a batch limit to avoid unbounded memory usage
        const expiredReservations = await stockReservationModel.find({
            status: "RESERVED",
            expiresAt: { $lte: now }
        }).limit(50);

        if (expiredReservations.length === 0) {
            return;
        }

        console.log(`[ExpiryWorker] Found ${expiredReservations.length} expired reservation(s). Processing release...`);

        for (const reservation of expiredReservations) {
            try {
                const result = await releaseReservation({ reservationId: reservation._id });
                if (result.success) {
                    console.log(`[ExpiryWorker] Released expired reservation: ${reservation._id} (Order: ${reservation.orderId})`);
                } else {
                    console.warn(`[ExpiryWorker] Could not release reservation ${reservation._id}: ${result.message}`);
                }
            } catch (resErr) {
                console.error(`[ExpiryWorker] Error releasing reservation ${reservation._id}:`, resErr.message);
            }
        }
    } catch (err) {
        console.error("[ExpiryWorker] Error during reservation expiration cleanup cycle:", err.message);
    }
};

/**
 * Starts the background worker for cleaning up expired stock reservations.
 */
const startReservationExpiryWorker = () => {
    if (workerIntervalId) {
        console.log("[ExpiryWorker] Worker is already running.");
        return;
    }

    const intervalMs = Number(process.env.RESERVATION_EXPIRY_INTERVAL_MS) || 60000;
    console.log(`[ExpiryWorker] Starting reservation expiration worker (Interval: ${intervalMs}ms)...`);

    // Run initial cleanup check immediately on startup
    cleanupExpiredReservations();

    // Schedule periodic execution
    workerIntervalId = setInterval(cleanupExpiredReservations, intervalMs);

    if (workerIntervalId.unref) {
        workerIntervalId.unref();
    }
};

/**
 * Stops the background worker.
 */
const stopReservationExpiryWorker = () => {
    if (workerIntervalId) {
        clearInterval(workerIntervalId);
        workerIntervalId = null;
        console.log("[ExpiryWorker] Stopped reservation expiration worker.");
    }
};

module.exports = {
    startReservationExpiryWorker,
    stopReservationExpiryWorker,
    cleanupExpiredReservations
};
