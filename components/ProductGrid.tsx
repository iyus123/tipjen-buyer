import { formatRupiah, normalizeWhatsAppNumber } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  is_published: boolean;
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80";

export default function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  const normalizedWa = normalizeWhatsAppNumber(whatsappNumber);

  return (
    <section className="product-grid">
      {products.map((item) => {
        const message = encodeURIComponent(
          `Halo, saya mau pesan produk Tipjen.%0A%0AProduk: ${item.name}%0AHarga: ${formatRupiah(item.price)}%0AStok: ${item.stock}%0A%0ATolong info cara order ya.`
        );
        const href = `https://wa.me/${normalizedWa}?text=${message}`;

        return (
          <article className="product-card" key={item.id}>
            <img src={item.image_url || DEFAULT_IMAGE} alt={item.name} />
            <div className="stack">
              <div className="wrap gap-sm">
                <span className="badge">{item.category || "Umum"}</span>
                <span className="muted small">Stok {item.stock}</span>
              </div>
              <h3>{item.name}</h3>
              <p className="muted product-desc">{item.description || "Produk tersedia dan siap dipesan via WhatsApp."}</p>
              <div className="price-row">
                <div>
                  <div className="muted small">Harga</div>
                  <strong>{formatRupiah(item.price)}</strong>
                </div>
                <a className="btn primary" href={href} target="_blank" rel="noreferrer">Beli via WhatsApp</a>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
