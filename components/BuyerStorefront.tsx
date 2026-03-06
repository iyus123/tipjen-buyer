"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  image?: string | null;
  is_published?: boolean | null;
  published?: boolean | null;
};

type CartItem = Product & { quantity: number };

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const fallbackImage =
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80";

export default function BuyerStorefront({
  storeName,
  whatsappNumber,
}: {
  storeName: string;
  whatsappNumber: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, category, price, stock, image_url, image, is_published, published")
        .or("is_published.eq.true,published.eq.true")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        setProducts((data ?? []) as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(
      products.map((item) => item.category?.trim()).filter(Boolean) as string[]
    );
    return ["Semua", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();
    return products.filter((item) => {
      const sameCategory = activeCategory === "Semua" || item.category === activeCategory;
      const sameKeyword =
        item.name.toLowerCase().includes(keyword) ||
        (item.description || "").toLowerCase().includes(keyword) ||
        (item.category || "").toLowerCase().includes(keyword);
      return sameCategory && sameKeyword;
    });
  }, [products, search, activeCategory]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(product.stock, 1)) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, Math.min(nextQty, Math.max(item.stock, 1))) };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const checkoutWhatsApp = () => {
    if (!cart.length) return;

    const lines = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}%0A   Qty: ${item.quantity}%0A   Harga: ${formatRupiah(item.price)}%0A   Subtotal: ${formatRupiah(item.price * item.quantity)}`
      )
      .join("%0A%0A");

    const text = `Halo ${storeName}, saya ingin memesan:%0A%0A${lines}%0A%0ATotal: ${formatRupiah(totalPrice)}%0A%0AMohon info proses selanjutnya ya.`;
    const sanitized = whatsappNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${sanitized}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f1ea_0%,#fffaf6_45%,#fff_100%)] text-stone-800">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-6 md:pt-10">
        <div className="overflow-hidden rounded-[32px] border border-[#eadfd6] bg-white/80 shadow-[0_20px_60px_rgba(110,84,60,0.08)] backdrop-blur">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr,0.8fr] md:px-10 md:py-12">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-[#f6e7da] px-4 py-2 text-sm font-medium text-[#9d6f4e]">
                Selamat datang di {storeName}
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                  Temukan produk favoritmu dan belanja dengan nyaman.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                  Pilih produk yang kamu suka, masukkan ke keranjang, lalu kirim pesananmu dengan mudah lewat WhatsApp.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-stone-600 shadow-sm ring-1 ring-[#eee2d7]">
                  <ShoppingBag className="h-4 w-4" /> Produk pilihan yang siap dibeli
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-stone-600 shadow-sm ring-1 ring-[#eee2d7]">
                  <ShoppingCart className="h-4 w-4" /> Checkout keranjang ke WhatsApp
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#f0e3d8] bg-[#fbf5f0] p-5 shadow-inner">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#eee2d7]">
                  <p className="text-sm text-stone-500">Produk tayang</p>
                  <p className="mt-3 text-3xl font-bold">{products.length}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#eee2d7]">
                  <p className="text-sm text-stone-500">Isi keranjang</p>
                  <p className="mt-3 text-3xl font-bold">{totalItems}</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#eee2d7]">
                <p className="text-sm text-stone-500">Total sementara</p>
                <p className="mt-3 text-3xl font-bold">{formatRupiah(totalPrice)}</p>
                <button
                  onClick={() => setCartOpen(true)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Lihat keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[#eadfd6] bg-white/85 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari produk favoritmu..."
              className="w-full rounded-2xl border border-[#eadfd6] bg-[#fffaf6] py-3 pl-11 pr-4 outline-none transition focus:border-[#cda988]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-stone-900 text-white"
                    : "bg-[#f7eee7] text-stone-700 hover:bg-[#efdfd1]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[28px] border border-[#eadfd6] bg-white p-4 shadow-sm">
                <div className="h-60 animate-pulse rounded-[24px] bg-[#f1e8df]" />
                <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-[#f1e8df]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#f5ede5]" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-[#f5ede5]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfd6] bg-white p-10 text-center text-stone-500 shadow-sm">
            Produk belum tersedia untuk filter yang dipilih.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(110,84,60,0.12)]"
              >
                <div className="relative overflow-hidden rounded-[24px] bg-[#f8f0e8]">
                  <img
                    src={product.image_url || product.image || fallbackImage}
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 px-1 pb-1 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-2 inline-flex rounded-full bg-[#f7eee7] px-3 py-1 text-xs font-medium text-[#9d6f4e]">
                        {product.category || "Produk pilihan"}
                      </p>
                      <h3 className="text-xl font-semibold leading-snug">{product.name}</h3>
                    </div>
                    <span className="rounded-full bg-[#fbf5f0] px-3 py-1 text-xs text-stone-500">
                      Stok {product.stock}
                    </span>
                  </div>

                  <p className="min-h-[48px] text-sm leading-6 text-stone-500">
                    {product.description || "Produk pilihan dengan kualitas terbaik untuk kebutuhanmu."}
                  </p>

                  <div className="flex items-end justify-between gap-4 pt-2">
                    <div>
                      <p className="text-xs text-stone-400">Harga</p>
                      <p className="text-2xl font-bold text-stone-900">{formatRupiah(product.price)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Tambah ke keranjang
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-stone-900 px-5 py-4 text-white shadow-[0_20px_40px_rgba(28,25,23,0.25)] transition hover:opacity-95"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-medium">Keranjang</span>
        <span className="rounded-full bg-white/15 px-2 py-1 text-sm">{totalItems}</span>
      </button>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Keranjang belanja</p>
                <h2 className="text-2xl font-bold">Pesanan kamu</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-[#f6eee7] px-4 py-2 text-sm text-stone-700"
              >
                Tutup
              </button>
            </div>

            {!cart.length ? (
              <div className="rounded-[24px] border border-dashed border-[#e7d8ca] bg-[#fffaf6] p-8 text-center text-stone-500">
                Keranjang masih kosong.
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-[#eadfd6] bg-[#fffdfb] p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image_url || item.image || fallbackImage}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-stone-500">{formatRupiah(item.price)}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-[#eadfd6] bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-2 text-stone-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-2 text-stone-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="rounded-full bg-red-50 p-2 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-[24px] border border-[#eadfd6] bg-[#fbf5f0] p-5">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Total item</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-lg font-bold">
                    <span>Total belanja</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>
                  <button
                    onClick={checkoutWhatsApp}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-4 py-4 font-semibold text-white transition hover:opacity-90"
                  >
                    Kirim pesanan via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
