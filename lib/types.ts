export type BuyerProduct = {
  id: number | string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock: number;
  image?: string | null;
  image_url?: string | null;
  published?: boolean;
  is_published?: boolean;
  tags?: string[];
};
