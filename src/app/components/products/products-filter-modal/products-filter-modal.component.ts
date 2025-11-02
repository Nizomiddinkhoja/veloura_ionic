import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, checkmarkOutline } from 'ionicons/icons';

export interface ProductsFilters {
  search?: string;
  min_buy_price?: number;
  max_buy_price?: number;
  min_sell_price?: number;
  max_sell_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  low_stock?: boolean;
  low_stock_threshold?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: string;
}

@Component({
  selector: 'app-products-filter-modal',
  templateUrl: './products-filter-modal.component.html',
  styleUrls: ['./products-filter-modal.component.scss'],
  standalone: false
})
export class ProductsFilterModalComponent implements OnInit {
  @Input() currentFilters?: ProductsFilters;

  filters: ProductsFilters = {
    search: '',
    min_buy_price: undefined,
    max_buy_price: undefined,
    min_sell_price: undefined,
    max_sell_price: undefined,
    min_quantity: undefined,
    max_quantity: undefined,
    low_stock: false,
    low_stock_threshold: 10,
    date_from: '',
    date_to: '',
    sort_by: 'id',
    sort_order: 'asc'
  };

  constructor(private modalCtrl: ModalController) {
    addIcons({ close, checkmarkOutline });
  }

  ngOnInit() {
    if (this.currentFilters) {
      this.filters = { ...this.currentFilters };
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  applyFilters() {
    // Удаляем пустые значения и дефолтные значения
    const cleanFilters: any = {};
    Object.keys(this.filters).forEach(key => {
      const value = (this.filters as any)[key];
      
      // Пропускаем пустые значения
      if (value === '' || value === null || value === undefined) {
        return;
      }
      
      // Пропускаем дефолтные значения
      if (key === 'low_stock' && value === false) {
        return;
      }
      if (key === 'low_stock_threshold' && value === 10 && !this.filters.low_stock) {
        return;
      }
      if (key === 'sort_by' && value === 'id') {
        return;
      }
      if (key === 'sort_order' && value === 'asc') {
        return;
      }
      
      cleanFilters[key] = value;
    });
    
    this.modalCtrl.dismiss(cleanFilters);
  }

  resetFilters() {
    this.filters = {
      search: '',
      min_buy_price: undefined,
      max_buy_price: undefined,
      min_sell_price: undefined,
      max_sell_price: undefined,
      min_quantity: undefined,
      max_quantity: undefined,
      low_stock: false,
      low_stock_threshold: 10,
      date_from: '',
      date_to: '',
      sort_by: 'id',
      sort_order: 'asc'
    };
  }
}
