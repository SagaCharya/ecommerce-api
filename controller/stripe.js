const stripe = require("stripe")(process.env.STRIPE_KEY);
const productModel = require("../models/product-model");
module.exports.payment = async function (req, res) {
  try {
    const { products, quanity } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products data." });
    }
    let totalAmount = 0;

    for (const productData of products) {
      const { product_id, quantity } = productData;
      const product = await productModel.findById(product_id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${productId} not found.` });
      }
      totalAmount += product.price * quantity;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
