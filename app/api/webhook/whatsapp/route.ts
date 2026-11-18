import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

const VerifyToken = process.env.META_VERIFY_TOKEN || 'Katapang123'

export async function GET(request: Request) {
  const { searchParams } = new URL (request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VerifyToken) {
    return new Response(challenge || '', {status : 200})
  }

  return new Response('Vertikal gagal', {status : 403})
}

  export async function POST(request: Request) {
  const body = await request.json()

  console.log('Webhook masuk:', JSON.stringify(body, null, 2))

  const entry = body.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]

  if (message) {
    const dari = message.from
    const isiPesan = message.text?.body

    console.log('Pesan dari:', dari, '- Isi:', isiPesan)

    let { data: contact } = await supabase
      .from('contacts')
      .select('id')
      .eq('identifier', dari)
      .eq('channel', 'whatsapp')
      .single()

    if (!contact) {
      const { data: newContact } = await supabase
        .from('contacts')
        .insert([{ nama: dari, channel: 'whatsapp', identifier: dari }])
        .select()
        .single()
      contact = newContact
    }

    let { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('contact_id', contact!.id)
      .eq('status', 'baru')
      .single()

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert([{ contact_id: contact!.id, status: 'baru' }])
        .select()
        .single()
      conversation = newConv
    }

    await supabase.from('messages').insert([{
      conversation_id: conversation!.id,
      sender_type: 'contact',
      content: isiPesan,
    }])
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}