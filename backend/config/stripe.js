const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
module.exports = stripe;