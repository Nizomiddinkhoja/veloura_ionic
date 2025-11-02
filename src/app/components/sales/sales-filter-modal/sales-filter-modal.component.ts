import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, checkmarkOutline } from 'ionicons/icons';

export interface SalesFilters {
  search?: string;
  customer_name?: string;
  min_total?: number;
  max_total?: number;
  paid?: boolean | null;
  status?: string;
  date_from?: string;
  date_to?: string;
  has_returns?: boolean;
  sort_by?: string;
  sort_order?: string;
}

@Component({
  selector: 'app-sales-filter-modal',
  templateUrl: './sales-filter-modal.component.html',
  styleUrls: ['./sales-filter-modal.component.scss'],
  standalone: false
})
export class SalesFilterModalComponent implements OnInit {
  @Input() currentFilters?: SalesFilters;

  filters: SalesFilters = {
    search: '',
    customer_name: '',
    min_total: undefined,
    max_total: undefined,
    paid: null,
    status: '',
    date_from: '',
    date_to: '',
    has_returns: false,
    sort_by: 'created_at',
    sort_order: 'desc'
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
      if (key === 'has_returns' && value === false) {
        return;
      }
      if (key === 'sort_by' && value === 'created_at') {
        return;
      }
      if (key === 'sort_order' && value === 'desc') {
        return;
      }
      
      cleanFilters[key] = value;
    });
    
    this.modalCtrl.dismiss(cleanFilters);
  }

  resetFilters() {
    this.filters = {
      search: '',
      customer_name: '',
      min_total: undefined,
      max_total: undefined,
      paid: null,
      status: '',
      date_from: '',
      date_to: '',
      has_returns: false,
      sort_by: 'created_at',
      sort_order: 'desc'
    };
  }
}
