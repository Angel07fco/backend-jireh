const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51QLMTZA0z2Im1xctEABuBMX2LOEBXbwWOLPUwMnJDhOv7BNwUhSpSwgqsZQEnQdcbL0FwoPsTggc7oxuZWRQhMJH00BpMZLFIb"
);

// Ruta para crear intención de pago
router.post("/intents", async (req, res) => {
  try {
    // Crear cliente de Stripe
    const customer = await stripe.customers.create();

    // Utiliza una versión de API válida
    const apiVersion = "2024-10-28.acacia"; // Puedes cambiar a una estable como "2023-08-01"

    // Crear una clave efímera para el cliente
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: apiVersion }
    );

    // Crear una intención de pago
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Monto en centavos (60000 centavos = $600.00)
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customer.id,
    });

    // Enviar los datos necesarios al frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
    });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
