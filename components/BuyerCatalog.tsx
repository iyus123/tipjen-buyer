'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, Minus, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import type { BuyerProduct } from '@/lib/types';

type CartItem = BuyerProduct & { qty: number };

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function resolveImage(product: BuyerProduct) {
  return (
    product.image_url ||
    product.image ||
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80'
  );
}

export default function BuyerCatalog({
  products,
  storeName,
  whatsappNumber
}: {
  products: BuyerProduct[];
  storeName: string;
  whatsappNumber: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(products.map((item) => item.category || 'Lainnya')))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const keyword = search.toLowerCase();
      const category = item.category || 'Lainnya';
      const matchesSearch =
        item.name.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword) ||
        (item.description || '').toLowerCase().includes(keyword);
      const matchesCategory = selectedCategory === 'Semua' || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const addToCart = (product: BuyerProduct) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock || 999) } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const nextQty = item.qty + delta;
          return { ...item, qty: Math.min(Math.max(nextQty, 0), item.stock || 999) };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const checkoutWhatsApp = () => {
    if (!cart.length) return;
    const lines = cart.map((item, index) => {
      const subtotal = item.price * item.qty;
      return `${index + 1}. ${item.name}%0AJumlah: ${item.qty}%0AHarga: ${formatRupiah(item.price)}%0ASubtotal: ${formatRupiah(subtotal)}`;
    });
    const message = `Halo ${storeName}, saya ingin memesan:%0A%0A${lines.join('%0A%0A')}%0A%0ATotal Belanja: ${formatRupiah(totalPrice)}%0A%0AMohon info proses selanjutnya ya.`;
    const normalized = whatsappNumber.startsWith('0') ? `62${whatsappNumber.slice(1)}` : whatsappNumber;
    window.open(`https://wa.me/${normalized}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f6efe8] text-[#4b342c]">
      <section className="relative overflow-hidden border-b border-[#eadbcf] bg-gradient-to-b from-[#fff8f3] to-[#f6efe8]">
        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#f2dfd3]/60 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-[#ead6c9]/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#e8d8cd] bg-white/70 px-4 py-2 text-sm font-medium text-[#8b6758] shadow-sm backdrop-blur">
              Cozy shop experience
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Selamat datang di {storeName}. Temukan produk pilihan dengan tampilan yang hangat, rapi, dan nyaman dilihat.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#7b5e52] md:text-lg">
              Pilih produk favoritmu, simpan dulu ke keranjang, lalu checkout praktis lewat WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[#eadbcf] bg-[#fffaf7]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a07f71]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk favoritmu..."
              className="w-full rounded-2xl border border-[#eadbcf] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#d8b7a5] focus:ring-4 focus:ring-[#f0dfd4]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-[#5c4033] text-white shadow'
                    : 'border border-[#e6d5ca] bg-white text-[#7b5e52] hover:bg-[#f9f1eb]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5c4033] px-5 py-3 font-medium text-white shadow-lg shadow-[#5c4033]/20 transition hover:opacity-95"
          >
            <ShoppingBag className="h-4 w-4" />
            Keranjang
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">{totalCartCount}</span>
          </button>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Produk pilihan untukmu</h2>
            <p className="mt-1 text-sm text-[#8a6c60]">Pilih produk yang kamu suka lalu tambahkan ke keranjang.</p>
          </div>
          <div className="hidden rounded-full border border-[#e8d8cd] bg-white px-4 py-2 text-sm text-[#8a6c60] md:block">
            {filteredProducts.length} produk ditemukan
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-[#eadbcf] bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d8b7a5]/20"
            >
              <div className="overflow-hidden rounded-[24px] bg-[#f8f1eb]">
                <img
                  src={resolveImage(item)}
                  alt={item.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f7ede6] px-3 py-1 text-xs font-medium text-[#8b6758]">
                    {item.category || 'Lainnya'}
                  </span>
                  <span className="text-xs text-[#9b7a6c]">Stok {item.stock}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug">{item.name}</h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#8a6c60]">{item.description || 'Produk pilihan dari Tipjen.'}</p>
                <p className="mt-4 text-xl font-bold text-[#4b342c]">{formatRupiah(item.price)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-4 w-full rounded-2xl bg-[#e8cbb8] px-4 py-3 font-semibold text-[#4b342c] transition hover:bg-[#dfbea8]"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-xl flex-col bg-[#fffaf7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadbcf] px-6 py-5">
              <div>
                <h3 className="text-2xl font-bold">Keranjang Belanja</h3>
                <p className="mt-1 text-sm text-[#8a6c60]">Cek kembali pesananmu sebelum checkout.</p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="rounded-full border border-[#e7d6cb] px-4 py-2 text-sm text-[#7b5e52] hover:bg-white"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#dfc9bc] bg-white p-8 text-center text-[#8a6c60]">
                  Keranjangmu masih kosong.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-[#eadbcf] bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      <img src={resolveImage(item)} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="mt-1 text-sm text-[#8a6c60]">{formatRupiah(item.price)}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="rounded-xl p-2 text-[#a37663] hover:bg-[#f8efe9]">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-[#eadbcf] bg-[#fffaf7] p-1">
                            <button onClick={() => changeQty(item.id, -1)} className="rounded-xl p-2 hover:bg-[#f6eee8]">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} className="rounded-xl p-2 hover:bg-[#f6eee8]">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-bold">{formatRupiah(item.qty * item.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#eadbcf] bg-white px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={checkoutWhatsApp}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle className="h-5 w-5" />
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
