import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { refresh, filterOutline } from "ionicons/icons";
import {
  AnalyticsFilterModalComponent,
  AnalyticsFilters
} from './analytics-filter-modal/analytics-filter-modal.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: false,
})
export class AnalyticsPage implements OnInit {
  // Текущие активные фильтры
  currentFilters: AnalyticsFilters = {};

  // Статистика
  analyticsData: AnalyticsData = {
    sold_cost: 0,
    returned_cost: 0,
    gross_profit: 0,
    refund_total: 0,
    paid_sales_total: 0,
    not_paid_sales_total: 0,
    returned_to_dealer: 0,
    current_stock_cost: 0,
    sales_count: 0,
    products_count: 0,
    total_revenue: 0,
    investment_balance: 0,
    cogs_balance: 0,
    profit_balance: 0,
  };

  constructor(
    private analyticsService: AnalyticsService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastService: ToastService,
  ) {
    addIcons({refresh, filterOutline});
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Загрузка аналитики...'
    });
    await loading.present();

    try {
      await this.loadAnalytics();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      this.toastService.error('Ошибка загрузки данных');
    } finally {
      await loading.dismiss();
    }
  }

  async loadAnalytics() {
    try {
      // Удаляем пустые значения из фильтров
      const cleanFilters: any = {};
      Object.entries(this.currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanFilters[key] = value;
        }
      });

      this.analyticsData = await this.analyticsService.getAnalytics(cleanFilters).toPromise() || this.analyticsData;
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
      this.toastService.error('Ошибка загрузки аналитики');
    }
  }

  async refreshData(event?: any) {
    this.loadData().then(() => {
      if (event) event.target.complete();
    });
  }

  async openFilters() {
    const modal = await this.modalController.create({
      component: AnalyticsFilterModalComponent,
      componentProps: {
        currentFilters: { ...this.currentFilters }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      // Обновляем только те фильтры, которые были изменены
      this.currentFilters = { ...this.currentFilters, ...data };
      this.loadAnalytics();
    }
  }
}
