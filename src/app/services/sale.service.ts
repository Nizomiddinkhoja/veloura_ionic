import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Sale } from '../models/sale.model';
import { Observable } from 'rxjs';


@Injectable()
export class SaleService {
  constructor(private api: ApiService) {}


  create(sale: Sale): Observable<Sale> { return this.api.post<Sale>('/sales', sale); }
  list(): Observable<Sale[]> { return this.api.get<Sale[]>('/sales'); }
  remove(id: number): Observable<any> { return this.api.delete(`/sales/${id}`); }
  paid(id: number): Observable<any> { return this.api.post(`/sales/paid/${id}`, null); }

  // Обновление комментария к продаже
  updateComment(id: number, comment: string): Observable<any> {
    return this.api.patch(`/sales/comment/${id}`, { comment });
  }

  // Возврат товаров по продаже
  returnItems(id: number, payload: { items: { product_id: number, quantity: number }[], comment?: string }): Observable<any> {
    return this.api.post(`/sales/return/${id}`, payload);
  }
}
