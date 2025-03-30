import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay credentials in environment variables');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a payment order
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise (multiply by 100 for INR)
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment signature
export const verifyPayment = (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Debugging logs (remove in production)
  console.log('Verifying payment with:');
  console.log('Order ID:', razorpayOrderId);
  console.log('Payment ID:', razorpayPaymentId);
  console.log('Signature:', razorpaySignature);
  console.log('Webhook Secret:', secret ? 'exists' : 'missing');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  console.log('Expected Signature:', expectedSignature);

  return expectedSignature === razorpaySignature;
};