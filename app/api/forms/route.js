import { db } from '@/app/configs'
import { JsonForms } from '@/app/configs/Schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }
    const forms = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, email))
      .orderBy(desc(JsonForms.id))
    return NextResponse.json(forms)
  } catch (error) {
    console.error('Forms fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
} 