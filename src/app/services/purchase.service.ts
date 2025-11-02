import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Purchase, Dealer } from '../models/purchase.model';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseService {
  constructor(private api: ApiService) {}

  // Purchases
  listPurchases(params?: any): Observable<Purchase[]> {
    return this.api.get<Purchase[]>('/purchases', params);
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.api.get<Purchase>(`/purchases/${id}`);
  }

  createPurchase(payload: Purchase): Observable<Purchase> {
    return this.api.post<Purchase>('/purchases', payload);
  }

  updatePurchase(id: number, payload: Partial<Purchase>): Observable<Purchase> {
    return this.api.put<Purchase>(`/purchases/${id}`, payload);
  }

  deletePurchase(id: number): Observable<any> {
    return this.api.delete(`/purchases/${id}`);
  }

  // Autocomplete
  searchDealers(query: string): Observable<Dealer[]> {
    return this.api.get<Dealer[]>(`/dealers?search=${query}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.api.get<Product[]>(`/products?search=${query}`);
  }

}
