import ProductGrid from "@/components/ProductGrid";
import { getPublicSupabase } from "@/lib/supabase";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const supabase = getPublicSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const storeName = process.env.STORE_NAME || "Tipjen";
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "083894403505";
  const products = data ?? [];

  return (
    <div>
      <section className="card hero">
        <div>
          <span className="badge">Web Pembeli</span>
          <h1>{storeName}</h1>
          <p className="muted">Katalog produk yang tampil di sini hanya yang sudah dipublikasikan dari web penjual.</p>
        </div>
        <a className="btn primary" href={`https://wa.me/${whatsappNumber.replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noreferrer">Hubungi Penjual</a>
      </section>

      <section className="toolbar">
        <div>
          <h2>Katalog Produk</h2>
          <p className="muted">Jumlah produk tampil: {products.length}</p>
        </div>
      </section>

      {products.length > 0 ? (
        <ProductGrid products={products} whatsappNumber={whatsappNumber} />
      ) : (
        <div className="card empty-box">
          <h3>Belum ada produk</h3>
          <p className="muted">Produk akan muncul di sini setelah dipublish dari web penjual.</p>
        </div>
      )}
    </div>
  );
}
