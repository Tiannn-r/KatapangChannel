import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Menangani request GET -> ambil semua contacts
export async function GET() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// Menangani request POST -> tambah contact baru
export async function POST(request: Request) {
  const body = await request.json()

  const { nama, channel, identifier, label } = body

  if (!nama || !channel || !identifier) {
    return NextResponse.json(
      { error: 'nama, channel, dan identifier wajib diisi' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([{ nama, channel, identifier, label }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}