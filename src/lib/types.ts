export interface Cake {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  published: boolean;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  cakeType: string;
  message: string;
}

export interface AboutContent {
  key: string;
  value: string;
}

export const CATEGORIES = [
  "Allt",
  "Afmæli",
  "Brúðkaup",
  "Ferming",
  "Skírn",
  "Annað",
] as const;

export type Category = (typeof CATEGORIES)[number];
