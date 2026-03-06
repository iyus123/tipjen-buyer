import BuyerCatalog from "@/components/BuyerCatalog";
import { env } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock, image_url, published")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <BuyerCatalog products={data || []} storeName={env.storeName} whatsappNumber={env.whatsappNumber} />;
}
