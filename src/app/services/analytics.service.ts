import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsFilters } from "../components/analytics/analytics-filter-modal/analytics-filter-modal.component";

export interface AnalyticsData {
  sold_cost: number;
  returned_cost: number;
  gross_profit: number;
  refund_total: number;
  paid_sales_total: number;
  not_paid_sales_total: number;
  returned_to_dealer: number;
  current_stock_cost: number;
  sales_count: number;
  products_count: number;
  total_revenue: number;
  investment_balance: number;
  cogs_balance: number;
  profit_balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `/analytics`;

  constructor(private http: HttpClient) {
  }

// analytics.service.ts
  getAnalytics(filters?: AnalyticsFilters): Observable<AnalyticsData> {
    let params = {};
    if (filters) {
      if (filters.date_from) params = {...params, date_from: filters.date_from};
      if (filters.date_to) params = {...params, date_to: filters.date_to};
    }
    return this.http.get<AnalyticsData>(this.apiUrl, {params});
  }
}
