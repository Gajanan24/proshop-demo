const asyncHandler = require('../middleware/asyncHandler')
const Order = require('../models/orderModel')
const Razorpay = require('razorpay');


const initiateRazorpayPayment = asyncHandler(async (req, res) => {
    const { orderId, amount } = req.body;

    // Initialize Razorpay client
    const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });

    // Construct options for Razorpay payment
    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: orderId, // unique identifier for the order
        payment_capture: 1 // Automatically capture the payment after successful authorization
    };

    try {
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create(options);

        // Send Razorpay order ID and key to frontend
        res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            razorpayKey: process.env.KEY_ID,
        });
    } catch (error) {
        console.error('Error initiating Razorpay payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
