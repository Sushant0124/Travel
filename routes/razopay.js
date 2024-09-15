const express = require('express');
const router = express.Router();
const razorpay = require('../init/razopay'); // Correct the filename path
const crypto = require('crypto');
require('dotenv').config(); // Ensure dotenv is loaded

// Create Order Route
router.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;
    console.log(`Received amount: ${amount}, currency: ${currency}`); // Expecting amount and currency from the client

    try {
        const options = {
            amount: amount , // Convert amount to smallest currency unit (paisa)
            currency: currency,
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        console.log(order);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Verify Payment Route
router.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Payment verified successfully
            res.send({ status: 'success' });
        } else {
            // Payment verification failed
            res.status(400).send({ status: 'failure', message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
