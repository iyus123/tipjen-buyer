import BuyerCatalog from "@/components/BuyerCatalog";
import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const products = (data || []).map((item) => ({
    ...item,
    published: item.is_published ?? item.published ?? false,
    image_url: item.image_url ?? item.image ?? "",
  }));

  return (
    <BuyerCatalog
      products={products}
      storeName={env.storeName}
      whatsappNumber={env.whatsappNumber}
    />
  );
}
