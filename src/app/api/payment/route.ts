import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

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