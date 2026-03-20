import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST() {
    try {
        const headersList = await headers();
        const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
        const protocol = headersList.get('x-forwarded-proto') || 'https';
        const origin = `${protocol}://${host}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: 'NEET DIVISION デジタルコンテンツ提供',
                        },
                        unit_amount: 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/order/success`,
            cancel_url: `${origin}/creator`,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error("Stripe API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
