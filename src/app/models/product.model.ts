import { PurchaseItem } from "./purchase.model";

export interface Product {
  id?: number;
  name: string;
  buy_price: number; // цена покупки
  sell_price: number; // цена продажи по умолчанию
  quantity: number; // текущее количество
  created_at?: string;
  purchase_items?: Partial<PurchaseItem>[];
}
