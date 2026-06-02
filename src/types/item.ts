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
  expireMonth?: string;
  store?: string;
  prices: PriceRecord[];
  createdAt?: string;
  updatedAt?: string;
};