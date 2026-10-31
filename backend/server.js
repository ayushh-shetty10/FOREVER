require("dotenv").config();
const { app } = require("./src/app");
const { connectDB } = require("./src/db/db");
const { connectCloudinary } = require("./src/services/cloudinary");
const { startReservationExpiryWorker } = require("./src/workers/reservationExpiryWorker");

connectDB().then(() => {
    // Start background worker for clearing expired stock reservations
    startReservationExpiryWorker();
}).catch(err => {
    console.error("Failed to connect DB:", err);
});

connectCloudinary();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
