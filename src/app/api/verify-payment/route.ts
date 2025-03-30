import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/payment';
import { supabase } from '@/lib/supabase';

// app/api/verify-payment/route.ts
export async function POST(request: Request) {
  try {
    const { paymentId, orderId, signature, userId, boxIndex } = await request.json();

    if (!paymentId || !orderId || !signature) {
      console.error('Missing payment verification fields');
      return NextResponse.json({ verified: false, error: 'Missing fields' }, { status: 400 });
    }

    const isVerified = verifyPayment(orderId, paymentId, signature);

    if (!isVerified) {
      console.error('Signature verification failed');
      return NextResponse.json({
        verified: false,
        error: 'Invalid signature'
      }, { status: 400 });
    }

    // Rest of your verification logic...
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        verified: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}