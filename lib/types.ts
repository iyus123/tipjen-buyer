export type BuyerProduct = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  image?: string | null;
  published?: boolean | null;
  is_published?: boolean | null;
};
