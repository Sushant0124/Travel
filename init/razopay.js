const Razorpay = require('razorpay');
require('dotenv').config(); // Load environment variables

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Add your Razorpay Key ID in the .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET // Add your Razorpay Secret in the .env file
});

module.exports = razorpay;
