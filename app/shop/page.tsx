import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";
import BuyerCatalog from "@/components/buyer-catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { data, error } = await supabase.from("products").select("*").eq("is_published", true).order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return <BuyerCatalog initialProducts={data ?? []} storeName={env.storeName} whatsappNumber={env.whatsappNumber} />;
}
