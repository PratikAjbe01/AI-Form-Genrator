import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(2),
    });

    return NextResponse.json({ orderId: order.id });
    
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
