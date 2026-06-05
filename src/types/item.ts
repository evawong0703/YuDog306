export type PriceRecord = {
  id: string;
  price: number;
  date: string;
};

export type Item = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  qty: number;
  minQty: number;
  unit: string;
  note?: string;
  expireDate?: string;
  store?: string;
  price?: number | null;
  prices: PriceRecord[];
  createdAt?: string;
  updatedAt?: string;
};