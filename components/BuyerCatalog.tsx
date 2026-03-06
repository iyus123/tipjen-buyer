"use client";

import { Search, ShoppingBag, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Product } from "@/lib/types";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function createWhatsAppLink(number: string, product: Product) {
  const cleanNumber = number.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    `Halo Tipjen, saya ingin pesan:

Produk: ${product.name}
Harga: ${formatter.format(product.price)}
Stok tersedia: ${product.stock}

Tolong info cara ordernya ya.`
  );
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export default function BuyerCatalog({ products, storeName, whatsappNumber }: { products: Product[]; storeName: string; whatsappNumber: string }) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();
    return products.filter((product) =>
      [product.name, product.category || "", product.description || ""]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, search]);

  return (
    <div className="shell stack-lg">
      <section className="hero">
        <div className="row-between wrap">
          <div className="stack-sm" style={{ maxWidth: 760 }}>
            <span className="badge"><Sparkles size={16} /> Cozy shop experience</span>
            <h1 className="title-xl">Selamat datang di {storeName}. Temukan produk pilihan dengan tampilan yang hangat, rapi, dan nyaman dilihat.</h1>
            <p className="muted">Semua produk di halaman ini otomatis tersinkron dari dashboard admin. Jika ada update harga atau stok dari penjual, katalog di sini ikut berubah.</p>
            <div className="row wrap">
              <span className="badge green"><ShieldCheck size={16} /> Produk yang tampil sudah dipublish</span>
              <span className="pill">Order via WhatsApp</span>
            </div>
          </div>

          <div className="panel" style={{ padding: 18, width: "100%", maxWidth: 360 }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: 15, color: "#7d6a61" }} />
              <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk cozy favoritmu..." />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="panel" style={{ padding: 20 }}>
          <span className="muted">Jumlah produk tayang</span>
          <h2 className="title-lg" style={{ marginTop: 10 }}>{products.length}</h2>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <span className="muted">Kategori beragam</span>
          <h2 className="title-lg" style={{ marginTop: 10 }}>{new Set(products.map((item) => item.category || "Umum")).size}</h2>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <span className="muted">WhatsApp toko</span>
          <h2 className="title-lg" style={{ marginTop: 10 }}>{whatsappNumber}</h2>
        </div>
      </section>

      <section className="products">
        {filteredProducts.length === 0 ? (
          <div className="empty" style={{ gridColumn: "1 / -1" }}>Belum ada produk yang cocok dengan pencarian Anda.</div>
        ) : (
          filteredProducts.map((product) => (
            <article className="card product-card" key={product.id}>
              <img className="product-cover" src={product.image_url || "https://placehold.co/900x900/f2e2d7/8f5a40?text=Tipjen"} alt={product.name} />
              <div className="product-body stack-md">
                <div className="row wrap">
                  {product.category ? <span className="pill">{product.category}</span> : null}
                  <span className="badge green">Stok {product.stock}</span>
                </div>

                <div className="stack-sm">
                  <h3 className="title-md">{product.name}</h3>
                  <div className="price">{formatter.format(product.price)}</div>
                  <p className="muted">{product.description || "Produk pilihan dari Tipjen siap dipesan langsung lewat WhatsApp."}</p>
                </div>

                <a className="btn btn-green" href={createWhatsAppLink(whatsappNumber, product)} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} /> Beli via WhatsApp
                </a>
              </div>
            </article>
          ))
        )}
      </section>

      <footer>
        <div className="row wrap"><ShoppingBag size={16} /> {storeName} · Katalog buyer terpisah dan sinkron dengan dashboard admin.</div>
      </footer>
    </div>
  );
}
