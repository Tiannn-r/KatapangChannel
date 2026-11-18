'use client'

import { useState } from 'react'

export default function Home() {
  const [nama, setNama] = useState('')
  const [channel, setChannel] = useState('whatsapp')
  const [identifier, setIdentifier] = useState('')
  const [label, setLabel] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Mengirim...')

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, channel, identifier, label }),
    })

    const result = await res.json()

    if (res.ok) {
      setStatus('Berhasil ditambahkan!')
      setNama('')
      setIdentifier('')
      setLabel('')
    } else {
      setStatus('Error: ' + result.error)
    }
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Tambah Contact</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
        </select>
        <input
          placeholder="Nomor HP / Username IG"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          placeholder="Label (contoh: Calon siswa, Umum) - opsional"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="submit">Simpan</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  )
}