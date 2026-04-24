import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_123', {
  apiVersion: '2026-03-25.dahlia' as any, // Use latest stable version for 2026
});

export async function POST(req: Request) {
  try {
    const { priceId, email } = await req.json();

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          // In a real app, you'd use a real Price ID from your Stripe Dashboard
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FairPlay Monthly Subscription',
              description: 'Access to monthly draws and premium golf analytics',
            },
            unit_amount: 1500, // $15.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${new URL(req.url).origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${new URL(req.url).origin}/dashboard?success=false`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
