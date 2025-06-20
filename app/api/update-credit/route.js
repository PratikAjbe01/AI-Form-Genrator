// app/api/update-credit/route.ts

import { db } from '@/configs'
import { User } from '@/configs/Schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, delta } = await req.json();

  try {

    const existingUser = await db.select().from(User).where(eq(User.email, email))

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

   
    const newCredit = delta;

 
    await db.update(User).set({ credit: newCredit }).where(eq(User.email, email))

    return NextResponse.json({ success: true, newCredit }, { status: 200 })
  } catch (error) {
    console.error('Credit update failed:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
