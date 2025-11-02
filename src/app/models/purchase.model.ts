export interface Dealer {
  id?: number;
  name: string;
}

export interface PurchaseItem {
  product_id?: number; // ID товара если выбран из списка
  product_name: string; // название товара
  quantity: number; // количество
  buy_price: number; // цена покупки за единицу
  sell_price: number; // цена продажи за единицу
  total_cost: number; // общая стоимость
  is_return?: boolean; // это возврат?
}

export interface Purchase {
  id?: number;
  dealer_id?: number; // ID дилера если выбран из списка
  dealer_name: string; // имя дилера
  items: PurchaseItem[]; // список товаров в закупке
  total_amount: number; // общая сумма закупки (с учетом возвратов)
  status: 'completed' | 'pending'; // статус
  notes?: string; // заметки
  created_at?: string;
  updated_at?: string;
}

