const { orderModel } = require("../models/ordersModel");
const { userModel } = require("../models/userModel");
const { stockReservationModel } = require("../models/stockReservationModel");
const { reserveStock, releaseReservation, confirmReservation } = require("../services/inventoryService");
const Stripe = require("stripe");
const razorpay = require("razorpay");
const crypto = require("crypto");

//global variables:
const currency = "inr";
const delivery_fee = 5.00;

//stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @route POST:api/orders/place
 * @description place orders using COD.
 */
const placeOrderCOD = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id;

    // 1. Reserve stock atomically
    const reservationRes = await reserveStock({ userId, items });
    if (!reservationRes.success) {
      return res.status(400).json({
        success: false,
        message: reservationRes.message,
        stockIssues: reservationRes.stockIssues
      });
    }

    const reservation = reservationRes.reservation;

    // 2. Create order
    let Order;
    try {
      Order = await orderModel.create({
        userId,
        items,
        amount,
        address,
        paymentMethod: "COD",
        payment: false,
        date: Date.now()
      });
    } catch (createErr) {
      // Rollback reservation if order creation fails
      await releaseReservation({ reservationId: reservation._id });
      throw createErr;
    }

    // 3. Link reservation to order & confirm reservation for COD
    await stockReservationModel.findByIdAndUpdate(reservation._id, { orderId: Order._id });
    const confirmRes = await confirmReservation({ reservationId: reservation._id, orderId: Order._id });

    if (!confirmRes.success) {
      // Stock reservation could not be confirmed (e.g. RELEASED/expired)
      await orderModel.findByIdAndUpdate(Order._id, { status: "REQUIRED_CHECK", payment: true });
      return res.status(200).json({
        success: true,
        isRequiredCheck: true,
        message: "COD order placed, but stock reservation could not be confirmed. Marked for REQUIRED_CHECK.",
        Order
      });
    }

    // 4. Clear user cart upon successful COD order creation
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: "Order placed (COD) successfully!",
      Order
    });
  }
  catch (err) {
    console.error("placeOrderCOD error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to place order!"
    });
  }
};

/**
 * @route POST:api/orders/stripe
 * @description place orders using Stripe checkout.
 */
const placeOrderStripe = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    // 1. Reserve stock atomically
    const reservationRes = await reserveStock({ userId, items });
    if (!reservationRes.success) {
      return res.status(400).json({
        success: false,
        message: reservationRes.message,
        stockIssues: reservationRes.stockIssues
      });
    }

    const reservation = reservationRes.reservation;

    // 2. Create order
    let newOrder;
    try {
      newOrder = await orderModel.create({
        userId,
        items,
        amount,
        address,
        paymentMethod: "Stripe",
        payment: false,
        date: Date.now()
      });
    } catch (createErr) {
      await releaseReservation({ reservationId: reservation._id });
      throw createErr;
    }

    // Link reservation to order
    await stockReservationModel.findByIdAndUpdate(reservation._id, { orderId: newOrder._id });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery fee"
        },
        unit_amount: delivery_fee * 100,
      },
      quantity: 1,
    });

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        line_items,
        mode: 'payment',
        metadata: {
          orderId: newOrder._id.toString()
        }
      });
    } catch (stripeErr) {
      await orderModel.findByIdAndUpdate(newOrder._id, { status: "Failed" });
      await releaseReservation({ reservationId: reservation._id });
      throw stripeErr;
    }

    return res.status(201).json({
      success: true,
      message: "Order placed (Stripe) successfully!",
      session_url: session.url
    });
  }
  catch (err) {
    console.error("placeOrderStripe error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to place order!"
    });
  }
};

/**
 * @route POST:api/orders/verifyStripe
 * @description verify Stripe payment and confirm reservation
 */
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, session_id } = req.body;
    const userId = req.user.id;

    if (success === "true" || success === true) {
      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required for verification."
        });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === 'paid' && session.metadata.orderId === orderId) {
        // Attempt stock reservation confirmation FIRST
        const confirmRes = await confirmReservation({ orderId });

        if (confirmRes.success) {
          // NORMAL SUCCESS: Reservation confirmed -> payment = true, normal status
          await orderModel.findByIdAndUpdate(orderId, { payment: true });
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
          return res.status(200).json({
            success: true,
            message: "Payment verified successfully!"
          });
        } else {
          // LATE PAYMENT SUCCESS / EXPIRED RESERVATION:
          // Payment provider verified payment success, but stock reservation is RELEASED!
          // Set status = REQUIRED_CHECK, payment = true. DO NOT re-reserve or mutate stock.
          await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "REQUIRED_CHECK" });
          await userModel.findByIdAndUpdate(userId, { cartData: {} });

          return res.status(200).json({
            success: true,
            isRequiredCheck: true,
            message: "Payment verified, but stock reservation expired. Order marked for REQUIRED_CHECK."
          });
        }
      } else {
        await orderModel.findByIdAndUpdate(orderId, { status: "Failed" });
        await releaseReservation({ orderId });

        return res.status(400).json({
          success: false,
          message: "Payment verification failed. Order marked as failed."
        });
      }
    } else {
      await orderModel.findByIdAndUpdate(orderId, { status: "Failed" });
      await releaseReservation({ orderId });

      return res.status(200).json({
        success: false,
        message: "Payment failed/cancelled. Order marked as failed."
      });
    }
  }
  catch (err) {
    console.error("verifyStripe error:", err);
    try {
      if (req.body.orderId) {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: "Failed" });
        await releaseReservation({ orderId: req.body.orderId });
      }
    } catch (dbErr) {
      console.error("Failed to mark order as failed or release stock on error:", dbErr);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to verify order!"
    });
  }
};

/**
 * @route POST:api/orders/razorpay
 * @description place orders using Razorpay.
 */
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id;

    // 1. Reserve stock atomically
    const reservationRes = await reserveStock({ userId, items });
    if (!reservationRes.success) {
      return res.status(400).json({
        success: false,
        message: reservationRes.message,
        stockIssues: reservationRes.stockIssues
      });
    }

    const reservation = reservationRes.reservation;

    // 2. Create order
    let newOrder;
    try {
      newOrder = await orderModel.create({
        userId,
        items,
        amount,
        address,
        paymentMethod: "Razorpay",
        payment: false,
        date: Date.now()
      });
    } catch (createErr) {
      await releaseReservation({ reservationId: reservation._id });
      throw createErr;
    }

    // Link reservation to order
    await stockReservationModel.findByIdAndUpdate(reservation._id, { orderId: newOrder._id });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.error("Razorpay order creation error:", error);
        await orderModel.findByIdAndUpdate(newOrder._id, { status: "Failed" });
        await releaseReservation({ reservationId: reservation._id });
        return res.status(400).json({
          success: false,
          message: "order creation failed!"
        });
      }
      return res.status(201).json({
        success: true,
        message: "Order placed (Razorpay) successfully!",
        order
      });
    });
  }
  catch (err) {
    console.error("placeOrderRazorpay error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to place order!"
    });
  }
};

/**
 * @route POST:api/orders/verifyRazorpay
 * @description verify Razorpay payment
 */
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature!",
      });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const orderId = orderInfo.receipt;
      const confirmRes = await confirmReservation({ orderId });

      if (confirmRes.success) {
        // NORMAL SUCCESS
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });
        return res.status(201).json({
          success: true,
          message: "Payment (Razorpay) successfull!",
        });
      } else {
        // LATE PAYMENT SUCCESS / EXPIRED RESERVATION:
        // Set status = REQUIRED_CHECK, payment = true. DO NOT re-reserve or mutate stock.
        await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "REQUIRED_CHECK" });
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

        return res.status(200).json({
          success: true,
          isRequiredCheck: true,
          message: "Payment verified, but stock reservation expired. Order marked for REQUIRED_CHECK."
        });
      }
    } else {
      const orderId = orderInfo.receipt;
      await orderModel.findByIdAndUpdate(orderId, { status: "Failed" });
      await releaseReservation({ orderId });

      return res.status(400).json({
        success: false,
        message: "Payment failed(Razorpay !",
      });
    }
  }
  catch (err) {
    console.error("verifyRazorpay error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify order!"
    });
  }
};

/**
 * @route GET:api/orders/list
 * @description get all orders for admin panel
 */
const allOrders = async (req, res) => {
  try {
    const allOrders = await orderModel.find({});

    return res.status(200).json({
      message: "Orders fetched successfully",
      allOrders
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch orders!",
    });
  }
};

/**
 * @route POST:api/orders/updateStatus
 * @description update status of order for admin panel
 */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    return res.status(200).json({
      message: "Status updated successfully",
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update status!",
    });
  }
};

/**
 * @route GET:api/orders/userorders
 * @description get orders of user.
 */
const userOrders = async (req, res) => {
  try {
    const userOrders = await orderModel.find({
      userId: req.user.id,
      $or: [
        { payment: true },
        { paymentMethod: "COD" }
      ]
    });

    return res.status(200).json({
      message: "orders fetched successfully",
      userOrders
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch orders!",
    });
  }
};

/**
 * @route POST:api/orders/markFailed
 * @description Mark order as failed when user dismisses modal or cancels
 */
const markFailed = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!"
      });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action!"
      });
    }

    if (order.payment === false && order.paymentMethod !== "COD") {
      order.status = "Failed";
      await order.save();

      // Release reserved stock immediately when marked failed
      await releaseReservation({ orderId });

      return res.status(200).json({
        success: true,
        message: "Order marked as failed successfully!"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Cannot mark paid or COD order as failed!"
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status!"
    });
  }
};

/**
 * @route POST /api/orders/reserve
 * @description Reserve inventory for items
 */
const reserveStockController = async (req, res) => {
  try {
    const { items, orderId, expiryMinutes } = req.body;
    const userId = req.user.id;

    const result = await reserveStock({
      userId,
      orderId,
      items,
      expiryMinutes
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("reserveStockController error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to reserve stock: " + err.message
    });
  }
};

/**
 * @route POST /api/orders/release-reservation
 * @description Release an active stock reservation
 */
const releaseReservationController = async (req, res) => {
  try {
    const { reservationId, orderId } = req.body;
    const userId = req.user.id;

    const result = await releaseReservation({
      reservationId,
      orderId,
      userId
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("releaseReservationController error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to release reservation: " + err.message
    });
  }
};

/**
 * @route POST /api/orders/confirm-reservation
 * @description Confirm a stock reservation
 */
const confirmReservationController = async (req, res) => {
  try {
    const { reservationId, orderId } = req.body;
    const userId = req.user.id;

    const result = await confirmReservation({
      reservationId,
      orderId,
      userId
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("confirmReservationController error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm reservation: " + err.message
    });
  }
};

module.exports = {
  allOrders,
  updateStatus,
  placeOrderCOD,
  placeOrderRazorpay,
  placeOrderStripe,
  userOrders,
  verifyRazorpay,
  verifyStripe,
  markFailed,
  reserveStockController,
  releaseReservationController,
  confirmReservationController
};