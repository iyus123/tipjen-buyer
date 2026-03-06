"use client";

import { MessageCircle, Minus, Moon, Plus, Search, ShoppingCart, Star, Sun, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

function ThemeButton() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tipjen-theme", next ? "dark" : "light");
  };
  return <button onClick={toggle} className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{dark ? "Mode terang" : "Mode gelap"}</button>;
}

export default function BuyerCatalog({ initialProducts, storeName, whatsappNumber }: { initialProducts: Product[]; storeName: string; whatsappNumber: string; }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [notice, setNotice] = useState("");

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(initialProducts.map((item) => item.category)))], [initialProducts]);
  const filteredProducts = useMemo(() => initialProducts.filter((item) => {
    const matchSearch = [item.name, item.category, item.description, ...(item.tags ?? [])].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua" || item.category === category;
    return matchSearch && matchCategory;
  }), [initialProducts, search, category]);

  const cartItems = cart.map((entry) => {
    const product = initialProducts.find((item) => item.id === entry.id);
    return product ? { ...product, qty: entry.qty, subtotal: product.price * entry.qty } : null;
  }).filter(Boolean) as Array<Product & { qty: number; subtotal: number }>;

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (id: string) => {
    const product = initialProducts.find((item) => item.id === id);
    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) return prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id, qty: 1 }];
    });
    if (product) {
      setNotice(`${product.name} berhasil dimasukkan ke keranjang`);
      setTimeout(() => setNotice(""), 1800);
    }
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0));
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));

  const checkout = () => {
    const lines = cartItems.map((item, index) => `${index + 1}. ${item.name}%0AJumlah: ${item.qty}%0AHarga: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}%0ASubtotal: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.subtotal)}`);
    const totalText = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total);
    const number = whatsappNumber.startsWith("0") ? `62${whatsappNumber.slice(1)}` : whatsappNumber;
    const message = `Halo ${storeName}, saya ingin memesan:%0A%0A${lines.join("%0A%0A")}%0A%0ATotal Belanja: ${totalText}%0A%0AMohon info proses selanjutnya ya.`;
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-brand-cream text-[#4a342b] dark:bg-slate-950 dark:text-white">
      {notice ? <div className="fixed right-6 top-6 z-[60] flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-medium text-emerald-700 shadow-soft dark:border-emerald-400/20 dark:bg-slate-900 dark:text-emerald-300"><ShoppingCart className="h-4 w-4" />{notice}</div> : null}
      <section className="relative overflow-hidden border-b border-brand-sand bg-gradient-to-b from-[#fff8f3] to-brand-cream dark:border-white/10 dark:from-[#111827] dark:to-[#020817]">
        <div className="absolute -left-10 top-0 h-60 w-60 rounded-full bg-brand-blush/80 blur-3xl dark:bg-amber-400/10" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-[#ead6c9]/60 blur-3xl dark:bg-sky-400/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8d8cd] bg-white/80 px-4 py-2 text-sm font-medium text-[#8b6758] dark:border-white/10 dark:bg-white/5 dark:text-amber-200"><Star className="h-4 w-4" />Tipjen • Belanja Mudah, Pilihan Berkualitas</div>
            <div className="relative">
              <div className="absolute -left-2 top-2 h-16 w-16 rounded-full bg-[#f0d9cb] blur-2xl dark:bg-amber-400/10" />
              <h1 className="relative text-5xl font-bold tracking-tight md:text-7xl">Tipjen</h1>
            </div>
            <p className="mt-4 max-w-xl text-lg leading-7 text-[#84685c] dark:text-slate-300 md:text-xl">Belanja barang bagus jadi lebih mudah di Tipjen. Temukan pilihan berkualitas yang cocok untuk kebutuhanmu.</p>
          </div>
        </div>
      </section>
      <section className="sticky top-0 z-20 border-b border-brand-sand bg-[#fffaf6]/85 backdrop-blur dark:border-white/10 dark:bg-[#020817]/85">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#84685c] dark:text-slate-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk favoritmu..." className="w-full rounded-2xl border border-brand-sand bg-white py-3 pl-11 pr-4 outline-none dark:border-white/10 dark:bg-white/5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item ? "bg-brand-cocoa text-white dark:bg-white dark:text-slate-900" : "border border-brand-sand bg-white text-[#6e5347] dark:border-white/10 dark:bg-white/5 dark:text-white"}`}>{item}</button>)}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-cocoa px-5 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"><ShoppingCart className="h-4 w-4" />Keranjang <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs dark:bg-slate-900 dark:text-white">{cartCount}</span></button>
            <ThemeButton />
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Produk pilihan untukmu</h2>
            <p className="mt-1 text-sm text-[#84685c] dark:text-slate-300">Pilih produk favoritmu lalu checkout dengan mudah lewat WhatsApp.</p>
          </div>
          <div className="hidden rounded-full border border-brand-sand bg-white px-4 py-2 text-sm md:block dark:border-white/10 dark:bg-white/5">{filteredProducts.length} produk ditemukan</div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-[30px] border border-brand-sand bg-white p-3 shadow-soft transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
              <div className="overflow-hidden rounded-[24px] bg-[#f7ede6] dark:bg-white/5"><img src={item.image_url || "https://placehold.co/800x800/png"} alt={item.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" /></div>
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between gap-2"><span className="rounded-full bg-[#f5ece5] px-3 py-1 text-xs font-medium text-[#8b6758] dark:bg-white/10 dark:text-slate-200">{item.category}</span><span className="text-xs text-[#84685c] dark:text-slate-300">Stok {item.stock}</span></div>
                <h3 className="text-xl font-bold leading-snug">{item.name}</h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#84685c] dark:text-slate-300">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">{(item.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-[#f4e8df] px-3 py-1 text-xs font-medium text-[#7d5f52] dark:bg-white/10 dark:text-slate-200">#{tag}</span>)}</div>
                <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xs text-[#84685c] dark:text-slate-300">Harga</p><p className="text-xl font-bold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}</p></div><button onClick={() => addToCart(item.id)} className="rounded-2xl bg-[#e7c6b1] px-4 py-3 font-semibold text-[#4a342b] dark:bg-white dark:text-slate-900">Tambah ke keranjang</button></div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {cartOpen ? <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"><div className="flex h-full w-full max-w-xl flex-col bg-[#fffaf6] text-[#4a342b] dark:bg-[#0f172a] dark:text-white"><div className="flex items-center justify-between border-b border-brand-sand px-6 py-5 dark:border-white/10"><div><h3 className="text-2xl font-bold">Keranjang belanja</h3><p className="mt-1 text-sm text-[#84685c] dark:text-slate-300">Cek kembali pesananmu sebelum checkout via WhatsApp.</p></div><button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-stone-100 dark:hover:bg-white/10"><X className="h-5 w-5" /></button></div><div className="flex-1 space-y-4 overflow-auto px-6 py-5">{cartItems.length === 0 ? <div className="rounded-[24px] border border-dashed border-brand-sand bg-white p-8 text-center text-[#84685c] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Keranjang masih kosong.</div> : cartItems.map((item) => <div key={item.id} className="rounded-[24px] border border-brand-sand bg-white p-4 dark:border-white/10 dark:bg-white/5"><div className="flex gap-4"><img src={item.image_url || "https://placehold.co/240x240/png"} alt={item.name} className="h-24 w-24 rounded-[20px] object-cover" /><div className="flex-1"><div className="flex items-start justify-between gap-3"><div><h4 className="font-bold">{item.name}</h4><p className="mt-1 text-sm text-[#84685c] dark:text-slate-300">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}</p></div><button onClick={() => removeItem(item.id)} className="rounded-xl p-2 hover:bg-stone-100 dark:hover:bg-white/10"><Trash2 className="h-4 w-4" /></button></div><div className="mt-4 flex items-center justify-between"><div className="inline-flex items-center gap-2 rounded-2xl border border-brand-sand bg-[#fffaf6] p-1 dark:border-white/10 dark:bg-white/5"><button onClick={() => changeQty(item.id, -1)} className="rounded-xl p-2 hover:bg-stone-100 dark:hover:bg-white/10"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-semibold">{item.qty}</span><button onClick={() => changeQty(item.id, 1)} className="rounded-xl p-2 hover:bg-stone-100 dark:hover:bg-white/10"><Plus className="h-4 w-4" /></button></div><p className="font-bold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.subtotal)}</p></div></div></div></div>)}</div><div className="border-t border-brand-sand bg-white px-6 py-5 dark:border-white/10 dark:bg-white/5"><div className="mb-4 flex items-center justify-between text-lg font-bold"><span>Total</span><span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</span></div><button disabled={cartItems.length === 0} onClick={checkout} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><MessageCircle className="h-5 w-5" />Checkout via WhatsApp</button></div></div></div> : null}
    </div>
  );
}
