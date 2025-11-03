import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';


@Injectable()
export class ProductService {
  constructor(private api: ApiService) {
  }


  list(params?: any): Observable<Product[]> {
    return this.api.get<Product[]>('/products', params);
  }

  get(id: number) {
    return this.api.get<Product>(`/products/${id}`);
  }

  create(payload: Partial<Product>) {
    return this.api.post<Product>('/products', payload);
  }

  update(id: number, payload: Partial<Product>) {
    return this.api.put(`/products/${id}`, payload);
  }

  remove(id: number) {
    return this.api.delete(`/products/${id}`);
  }
}
