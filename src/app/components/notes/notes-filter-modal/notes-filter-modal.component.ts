import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, checkmarkOutline } from 'ionicons/icons';

export interface NotesFilters {
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: string;
}

@Component({
  selector: 'app-notes-filter-modal',
  templateUrl: './notes-filter-modal.component.html',
  styleUrls: ['./notes-filter-modal.component.scss'],
  standalone: false
})
export class NotesFilterModalComponent implements OnInit {
  @Input() currentFilters?: NotesFilters;

  filters: NotesFilters = {
    search: '',
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
      date_from: '',
      date_to: '',
      sort_by: 'id',
      sort_order: 'asc'
    };
  }
}
