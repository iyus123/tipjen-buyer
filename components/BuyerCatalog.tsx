"use client";

import { MessageCircle, Minus, Plus, Search, ShoppingCart, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

type BuyerCatalogProps = {
  products: Product[];
  storeName: string;
  whatsappNumber: string;
};

type CartItem = {
  id: string | number;
  qty: number;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function normalizeWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export default function BuyerCatalog({
  products,
  storeName,
  whatsappNumber,
}: BuyerCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tipjen-theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("tipjen-theme", dark ? "dark" : "light");
  }, [dark]);

  const normalizedProducts = useMemo(() => {
    return (products || []).map((item) => ({
      ...item,
      category: item.category ?? "Lainnya",
      description: item.description ?? "",
      image_url: item.image_url ?? item.image ?? "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      published: item.is_published ?? item.published ?? false,
      price: Number(item.price || 0),
      stock: Number(item.stock || 0),
    }));
  }, [products]);

  const categories = useMemo(() => {
    return [
      "Semua",
      ...Array.from(
        new Set(
          normalizedProducts
            .map((item) => item.category)
            .filter((item): item is string => Boolean(item))
        )
      ),
    ];
  }, [normalizedProducts]);

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((item) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.tags.some((tag) => tag.toLowerCase().includes(keyword));

      const matchCategory = category === "Semua" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [normalizedProducts, search, category]);

  const cartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = normalizedProducts.find((item) => item.id === entry.id);
        if (!product) return null;
        return {
          ...product,
          qty: entry.qty,
          subtotal: product.price * entry.qty,
        };
      })
      .filter(Boolean) as Array<
      Product & {
        id: string | number;
        category: string;
        description: string;
        image_url: string;
        tags: string[];
        qty: number;
        subtotal: number;
      }
    >;
  }, [cart, normalizedProducts]);

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function showNotice(message: string) {
    setNotice(message);
    window.clearTimeout((showNotice as unknown as { timer?: number }).timer);
    (showNotice as unknown as { timer?: number }).timer = window.setTimeout(() => {
      setNotice("");
    }, 1800);
  }

  function addToCart(id: string | number) {
    const product = normalizedProducts.find((item) => item.id === id);
    if (!product) return;

    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });

    showNotice(`${product.name} berhasil dimasukkan ke keranjang`);
  }

  function removeItem(id: string | number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function increaseQty(id: string | number) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  }

  function decreaseQty(id: string | number) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function checkoutWhatsApp() {
    if (cartItems.length === 0) return;

    const lines = cartItems.map(
      (item, index) =>
        `${index + 1}. ${item.name}
Jumlah: ${item.qty}
Harga: ${formatRupiah(item.price)}
Subtotal: ${formatRupiah(item.subtotal)}`
    );

    const message = `Halo ${storeName}, saya ingin memesan:

${lines.join("\n\n")}

Total Belanja: ${formatRupiah(total)}

Mohon info proses selanjutnya ya.`;

    const url = `https://wa.me/${normalizeWhatsappNumber(
      whatsappNumber
    )}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  const shell = dark ? "bg-[#020817] text-white" : "bg-[#f8f2ec] text-[#4a342b]";
  const card = dark ? "bg-white/5 border-white/10" : "bg-white border-[#ead9cc]";
  const soft = dark ? "text-slate-300" : "text-[#84685c]";

  return (
    <div className={`${shell} min-h-screen transition-colors`}>
      <section
        className={`relative overflow-hidden border-b ${
          dark
            ? "border-white/10 bg-gradient-to-b from-[#111827] to-[#020817]"
            : "border-[#ead9cc] bg-gradient-to-b from-[#fff8f3] to-[#f8f2ec]"
        }`}
      >
        <div
          className={`absolute -left-10 top-0 h-60 w-60 rounded-full blur-3xl ${
            dark ? "bg-amber-400/10" : "bg-[#f2dfd3]/80"
          }`}
        />
        <div
          className={`absolute right-0 top-10 h-72 w-72 rounded-full blur-3xl ${
            dark ? "bg-sky-400/10" : "bg-[#ead6c9]/60"
          }`}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="max-w-3xl">
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                dark
                  ? "border-white/10 bg-white/5 text-amber-200"
                  : "border-[#e8d8cd] bg-white/80 text-[#8b6758]"
              }`}
            >
              <Star className="h-4 w-4" />
              Tipjen • Belanja Mudah, Pilihan Berkualitas
            </div>

            <div className="relative">
              <div
                className={`absolute -left-2 top-2 h-16 w-16 rounded-full blur-2xl ${
                  dark ? "bg-amber-400/10" : "bg-[#f0d9cb]"
                }`}
              />
              <h1 className="relative text-5xl font-bold tracking-tight md:text-7xl">
                Tipjen
              </h1>
            </div>

            <p className={`mt-4 max-w-xl text-lg leading-7 md:text-xl ${soft}`}>
              Belanja barang bagus jadi lebih mudah di Tipjen. Temukan pilihan
              berkualitas yang cocok untuk kebutuhanmu.
            </p>
          </div>
        </div>
      </section>

      <div
        className={`sticky top-0 z-20 border-b backdrop-blur ${
          dark
            ? "border-white/10 bg-[#020817]/85"
            : "border-[#ead9cc] bg-[#fffaf6]/85"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${soft}`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk favoritmu..."
              className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none ${
                dark
                  ? "border-white/10 bg-white/5"
                  : "border-[#ead9cc] bg-white"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? dark
                      ? "bg-white text-slate-900"
                      : "bg-[#4f342b] text-white"
                    : dark
                    ? "border border-white/10 bg-white/5 text-white"
                    : "border border-[#ead9cc] bg-white text-[#6e5347]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((prev) => !prev)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                dark
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-[#ead9cc] bg-white text-[#6e5347]"
              }`}
            >
              {dark ? "Mode terang" : "Mode gelap"}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold ${
                dark ? "bg-white text-slate-900" : "bg-[#4f342b] text-white"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Keranjang
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  dark ? "bg-slate-900 text-white" : "bg-white/20"
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {notice && (
          <div
            className={`fixed right-6 top-6 z-[60] flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-medium shadow-xl ${
              dark
                ? "border-emerald-400/20 bg-emerald-400/20 text-emerald-200"
                : "border-emerald-200 bg-white text-emerald-700"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {notice}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Produk pilihan untukmu</h2>
            <p className={`mt-1 text-sm ${soft}`}>
              Temukan produk terbaik dan masukkan ke keranjang sebelum checkout.
            </p>
          </div>

          <div
            className={`hidden rounded-full border px-4 py-2 text-sm md:block ${
              dark ? "border-white/10 bg-white/5" : "border-[#ead9cc] bg-white"
            }`}
          >
            {filteredProducts.length} produk ditemukan
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-[30px] border p-3 transition duration-300 hover:-translate-y-1 ${card}`}
            >
              <div
                className={`overflow-hidden rounded-[24px] ${
                  dark ? "bg-white/5" : "bg-[#f7ede6]"
                }`}
              >
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      dark
                        ? "bg-white/10 text-slate-200"
                        : "bg-[#f5ece5] text-[#8b6758]"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className={`text-xs ${soft}`}>Stok {item.stock}</span>
                </div>

                <h3 className="text-xl font-bold leading-snug">{item.name}</h3>
                <p className={`mt-2 min-h-[48px] text-sm leading-6 ${soft}`}>
                  {item.description}
                </p>

                {item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          dark
                            ? "bg-white/10 text-slate-200"
                            : "bg-[#f4e8df] text-[#7d5f52]"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className={`text-xs ${soft}`}>Harga</p>
                    <p className="text-xl font-bold">{formatRupiah(item.price)}</p>
                  </div>

                  <button
                    onClick={() => addToCart(item.id)}
                    className={`rounded-2xl px-4 py-3 font-semibold ${
                      dark ? "bg-white text-slate-900" : "bg-[#e7c6b1] text-[#4a342b]"
                    }`}
                  >
                    Tambah ke keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div
            className={`flex h-full w-full max-w-xl flex-col ${
              dark ? "bg-[#0f172a] text-white" : "bg-[#fffaf6] text-[#4a342b]"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${
                dark ? "border-white/10" : "border-[#ead9cc]"
              }`}
            >
              <div>
                <h3 className="text-2xl font-bold">Keranjang belanja</h3>
                <p className={`mt-1 text-sm ${soft}`}>
                  Cek kembali pesananmu sebelum checkout via WhatsApp.
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className={`rounded-full p-2 ${dark ? "hover:bg-white/10" : "hover:bg-stone-100"}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <div
                  className={`rounded-[24px] border p-6 text-center ${
                    dark ? "border-white/10 bg-white/5" : "border-[#ead9cc] bg-white"
                  }`}
                >
                  Keranjang masih kosong.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className={`rounded-[24px] border p-4 ${card}`}>
                    <div className="flex gap-4">
                      <img
                        src={item.image_url || "/placeholder.png"}
                        alt={item.name}
                        className="h-24 w-24 rounded-[20px] object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className={`mt-1 text-sm ${soft}`}>
                              {formatRupiah(item.price)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className={`rounded-xl p-2 ${dark ? "hover:bg-white/10" : "hover:bg-stone-100"}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div
                            className={`inline-flex items-center gap-2 rounded-2xl border p-1 ${
                              dark
                                ? "border-white/10 bg-white/5"
                                : "border-[#ead9cc] bg-[#fffaf6]"
                            }`}
                          >
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className={`rounded-xl p-2 ${dark ? "hover:bg-white/10" : "hover:bg-stone-100"}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="w-8 text-center font-semibold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => increaseQty(item.id)}
                              className={`rounded-xl p-2 ${dark ? "hover:bg-white/10" : "hover:bg-stone-100"}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="font-bold">{formatRupiah(item.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className={`border-t px-6 py-5 ${
                dark ? "border-white/10 bg-white/5" : "border-[#ead9cc] bg-white"
              }`}
            >
              <div className="mb-4 flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>

              <button
                onClick={checkoutWhatsApp}
                disabled={cartItems.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
