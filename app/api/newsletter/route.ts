import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const entry = await prisma.newsletterSubscription.create({
      data: { email }
    });
    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Already subscribed or invalid" }, { status: 400 });
  }
}
