# Tipjen Buyer

Web pembeli khusus katalog Tipjen.

## Environment Variables

Copy `.env.example` ke `.env.local` lalu isi:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STORE_NAME`
- `WHATSAPP_NUMBER`

## Jalankan lokal

```bash
npm install
npm run dev
```

## Deploy Vercel

Upload project ini ke repo GitHub terpisah, lalu import ke Vercel.

Project ini hanya menampilkan produk yang `is_published = true` dari Supabase.
