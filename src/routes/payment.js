const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constant");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

// Create Razorpay order endpoint
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    // Create order on Razorpay
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    // Save order info in DB
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // Send order details + Razorpay keyId to frontend
    res.json({ 
      ...savedPayment.toJSON(), 
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Razorpay webhook to verify payment and update DB
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    // Verify webhook signature
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    // Extract payment info from webhook payload
    const paymentDetails = req.body.payload.payment.entity;

    // Find payment record and update status
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (payment) {
      payment.status = paymentDetails.status;
      await payment.save();

      // Mark user as premium if payment successful
      if (payment.status === "captured") {
        const user = await User.findById(payment.userId);
        if (user) {
          user.isPremium = true;
          user.membershipType = payment.notes.membershipType;
          await user.save();
        }
      }
    }

    res.status(200).json({ msg: "Webhook processed successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Verify premium membership status endpoint
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  res.json(user);
});

module.exports = paymentRouter;
