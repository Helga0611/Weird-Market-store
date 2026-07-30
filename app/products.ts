import catalog from "./catalog-data.json";
import stores from "./stores-data.json";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  longDescription: string;
  users: number;
  usage: string;
  image: string;
  gallery: string[];
  tags: string[];
  rating: number;
  stock: number;
  vendorSlug: string;
  vendorName: string;
  colors: string[];
};

export type Store = {
  slug: string;
  name: string;
  blurb: string;
  category: string;
};

export type CartItem = Product & { quantity: number };

export const PRODUCTS = catalog as Product[];
export const STORES = stores as Store[];

export const money = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
