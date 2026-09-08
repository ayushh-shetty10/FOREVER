const mongoose = require("mongoose");

/**
 * Product Schema
 * 
 * Stock Semantics:
 * - totalStock: Current total UNSOLD inventory remaining. Includes both available and temporarily reserved units.
 *               Decreases when a reservation is CONFIRMED. Does NOT change when a reservation is created or released.
 * - reservedStock: Units temporarily locked by active checkout/payment reservations.
 * - availableStock: Units currently available for new reservations.
 * 
 * Primary Stock Invariant:
 *   totalStock === availableStock + reservedStock
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    bestseller: {
        type: Boolean,
    },
    totalStock: {
        type: Number,
        required: true,
        default: 10,
        min: [0, "totalStock cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "totalStock must be an integer"
        }
    },
    reservedStock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "reservedStock cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "reservedStock must be an integer"
        }
    },
    availableStock: {
        type: Number,
        required: true,
        default: function () {
            return this.totalStock !== undefined ? this.totalStock - (this.reservedStock || 0) : 10;
        },
        min: [0, "availableStock cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "availableStock must be an integer"
        }
    },
    date: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

/**
 * Pre-validation hook to enforce totalStock === availableStock + reservedStock
 */
productSchema.pre("validate", function () {
    if (this.reservedStock === undefined) {
        this.reservedStock = 0;
    }
    if (this.totalStock !== undefined && this.availableStock === undefined) {
        this.availableStock = this.totalStock - this.reservedStock;
    }
    if (this.totalStock !== undefined && this.reservedStock !== undefined && this.availableStock !== undefined) {
        if (this.totalStock !== this.availableStock + this.reservedStock) {
            this.invalidate("availableStock", "totalStock must equal availableStock + reservedStock");
        }
    }
});

const productModel = mongoose.model("product", productSchema);
module.exports = { productModel };