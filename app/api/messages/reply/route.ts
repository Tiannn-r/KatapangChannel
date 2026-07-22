import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
    const body = await request.json()
    const {conversation_id, to, content } = body

    if (!conversation_id || !to || !content) {
        return NextResponse.json(
        { error: 'conversation_id, to, dan content wajib diisi' },
        { status: 400}
    )
    }

    const metaResponse = await fetch(
        `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: content },
            }),
        }
    )
    
    const metaResult = await metaResponse.json()

        if (!metaResponse.ok) {
            console.error('Gagal kirim ke WhatsApp:', metaResult)
            return NextResponse.json(
                { error: 'Gagal mengirim ke WhatsApp', detail: metaResult },
                { status: 500 }
            )
        }

    const { data, error } = await supabase
        .from('messages')
        .insert([
            {
                conversation_id,
                sender_type: 'agent',
                content,
            },
        ])
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
}


