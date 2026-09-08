const mongoose = require("mongoose");

const reservationItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    }
  },
  { _id: false }
);

const stockReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true
    },
    items: {
      type: [reservationItemSchema],
      required: true,
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: "Reservation must contain at least one item"
      }
    },
    status: {
      type: String,
      required: true,
      enum: ["RESERVED", "CONFIRMED", "RELEASED"],
      default: "RESERVED"
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

stockReservationSchema.index({ orderId: 1 });
stockReservationSchema.index({ status: 1, expiresAt: 1 });

const stockReservationModel = mongoose.model("stockReservation", stockReservationSchema);

module.exports = { stockReservationModel };
