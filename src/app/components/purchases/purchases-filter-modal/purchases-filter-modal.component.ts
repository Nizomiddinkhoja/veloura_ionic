import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, checkmarkOutline } from 'ionicons/icons';

export interface PurchasesFilters {
  search?: string;
  min_amount?: number;
  max_amount?: number;
  date_from?: string;
  date_to?: string;
  has_returns?: boolean;
  sort_by?: string;
  sort_order?: string;
}

@Component({
  selector: 'app-purchases-filter-modal',
  templateUrl: './purchases-filter-modal.component.html',
  styleUrls: ['./purchases-filter-modal.component.scss'],
  standalone: false
})
export class PurchasesFilterModalComponent implements OnInit {
  @Input() currentFilters?: PurchasesFilters;

  filters: PurchasesFilters = {
    search: '',
    min_amount: undefined,
    max_amount: undefined,
    date_from: '',
    date_to: '',
    has_returns: false,
    sort_by: 'id',
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
      if (key === 'sort_by' && value === 'id') {
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
      min_amount: undefined,
      max_amount: undefined,
      date_from: '',
      date_to: '',
      has_returns: false,
      sort_by: 'id',
      sort_order: 'desc'
    };
  }
}
