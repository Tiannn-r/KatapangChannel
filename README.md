# Katapang Channel - Omnichat Sekolah

Aplikasi Full-Stack **Next.js & React** yang menggabungkan antarmuka Omnichat (`Omnichat-FE`) dan backend API routes serta webhook WhatsApp (`KatapangChannel`) ke dalam **satu proyek terpadu**.

---

## Fitur Utama

- **Frontend (React 19 & Tailwind CSS / Custom CSS)**:
  - Antarmuka inbox percakapan multi-channel (WhatsApp, Instagram).
  - Jendela chat interaktif, starred messages, dan pelabelan kontak.
  - Komponen modular di folder `components/` dan state interaktif di `app/page.tsx`.
- **Backend (Next.js App Router API Routes)**:
  - `POST & GET /api/contacts`: Manajemen kontak tersimpan di Supabase.
  - `POST /api/messages/reply`: Mengirim balasan ke WhatsApp via Meta Cloud API.
  - `GET & POST /api/webhook/whatsapp`: Verifikasi dan penerimaan pesan webhook WhatsApp.
  - Database client terintegrasi di `lib/supabase.ts`.
- **Halaman Pengujian Kontak**:
  - `/contacts-test`: Form cepat untuk menambahkan data kontak ke database.

---

## Struktur Folder Proyek

```text
Katapang-Channel/
├── app/
│   ├── api/
│   │   ├── contacts/route.ts          # API Kontak
│   │   ├── messages/reply/route.ts    # API Balas Pesan Meta
│   │   └── webhook/whatsapp/route.ts  # Webhook WhatsApp
│   ├── contacts-test/
│   │   └── page.tsx                   # Form test tambah kontak
│   ├── App.css                        # Styling Omnichat UI
│   ├── globals.css                    # Tailwind CSS globals
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Halaman utama Omnichat UI
├── components/                        # Komponen React (ChatWindow, ConversationList, dll)
├── data/                              # Data percakapan & pesan
├── lib/
│   └── supabase.ts                    # Supabase Client
├── public/                            # Asset statis (SVG, ikon)
├── .env.example                       # Contoh environment variables
├── package.json                       # Dependensi Next.js, React 19, Lucide, Supabase
└── tsconfig.json                      # Konfigurasi TypeScript & path alias (@/*)
```

---

## Cara Menjalankan

### 1. Salin Environment Variables
Buat file `.env.local` dari `.env.example`:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial Supabase dan Meta WhatsApp Anda:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_TOKEN`

### 2. Jalankan Server Development
Cukup jalankan satu perintah untuk menjalankan Frontend dan Backend secara bersamaan:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi Omnichat.
Buka [http://localhost:3000/contacts-test](http://localhost:3000/contacts-test) untuk menguji penambahan kontak.

### 3. Build Produksi
```bash
npm run build
npm run start
```
