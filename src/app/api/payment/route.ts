// app/api/payment/route.ts
import { createRazorpayOrder } from '@/lib/payment';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment processor not configured' },
        { status: 500 }
      );
    }

    const { amount } = await request.json();
    const order = await createRazorpayOrder(amount);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}