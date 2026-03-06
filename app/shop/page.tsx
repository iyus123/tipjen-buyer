import BuyerCatalog from '@/components/BuyerCatalog';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';
import type { BuyerProduct } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, category, price, stock, image_url, image, is_published, published')
    .or('is_published.eq.true,published.eq.true')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const products: BuyerProduct[] = (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
    image_url: item.image_url,
    image: item.image,
    is_published: item.is_published,
    published: item.published ?? item.is_published
  }));

  return <BuyerCatalog products={products} storeName={env.storeName} whatsappNumber={env.whatsappNumber} />;
}
