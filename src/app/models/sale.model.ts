export interface SaleItem {
  product_id: number;
  name?: string;
  quantity: number;
  sell_price: number; // цена продажи для этой позиции
  buy_price: number; // цена продажи для этой позиции
}

export interface SaleReturnItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  sell_price: number;
  buy_price: number;
  refund_amount: number;
  comment: string;
  created_at: string;
}

export interface SaleReturnLine {
  product_id: number;
  name?: string;
  max: number;
  qty: number;
  selected: boolean;
  comment: string;
}


export interface Sale {
  id?: number;
  customer_name: string;
  comment?: string;
  items: SaleItem[];
  returns?: SaleReturnItem[];
  total?: number;
  paid: boolean;
  created_at?: string;
}
