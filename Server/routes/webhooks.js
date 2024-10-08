const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_3085f0cef9ae71bea7e16935f13c8fc46906d4d34cc6ca7ba716126329d74ee1";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send(200);
});

