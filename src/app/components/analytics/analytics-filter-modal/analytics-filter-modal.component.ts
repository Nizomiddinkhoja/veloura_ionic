import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, checkmarkOutline } from 'ionicons/icons';

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
}

@Component({
  selector: 'app-analytics-filter-modal',
  templateUrl: './analytics-filter-modal.component.html',
  styleUrls: ['./analytics-filter-modal.component.scss'],
  standalone: false
})
export class AnalyticsFilterModalComponent implements OnInit {
  @Input() currentFilters?: AnalyticsFilters;

  filters: AnalyticsFilters = {
    date_from: '',
    date_to: '',
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
    // Удаляем пустые значения
    const cleanFilters: any = {};
    Object.keys(this.filters).forEach(key => {
      const value = (this.filters as any)[key];

      // Пропускаем пустые значения
      if (value !== '' && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });

    this.modalCtrl.dismiss(cleanFilters);
  }

  resetFilters() {
    this.filters = {
      date_from: '',
      date_to: '',
    };
  }

  // Быстрые фильтры
  setToday() {
    const today = new Date().toISOString().split('T')[0];
    this.filters.date_from = today;
    this.filters.date_to = today;
  }

  setThisWeek() {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    this.filters.date_from = firstDay.toISOString().split('T')[0];
    this.filters.date_to = lastDay.toISOString().split('T')[0];
  }

  setThisMonth() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.filters.date_from = firstDay.toISOString().split('T')[0];
    this.filters.date_to = lastDay.toISOString().split('T')[0];
  }

  setLastMonth() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    this.filters.date_from = firstDay.toISOString().split('T')[0];
    this.filters.date_to = lastDay.toISOString().split('T')[0];
  }
}
