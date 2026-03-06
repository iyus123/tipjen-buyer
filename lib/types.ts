export type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  image_url?: string | null;
  published?: boolean;
  is_published?: boolean;
  tags?: string[];
};
