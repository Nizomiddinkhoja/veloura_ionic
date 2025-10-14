import { Component, inject, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { Product } from '../../models/product.model';
import { Sale } from '../../models/sale.model';
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { refresh } from "ionicons/icons";

interface TopSellingProduct {
  name: string;
  totalSold: number;
  revenue: number;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: false,
})
export class AnalyticsPage implements OnInit {
  products: Product[] = [];
  sales: Sale[] = [];
  filteredSales: Sale[] = [];

  // Фильтры по дате
  dateFrom: string = '';
  dateTo: string = '';

  // Статистика
  totalProducts: number = 0;
  totalSales: number = 0;
  notPaidSales: number = 0;
  totalRevenue: number = 0;
  totalProfit: number = 0;
  currentProfit: number = 0;
  totalCost: number = 0; // Себестоимость проданных товаров
  currentStockValue: number = 0; // Актуальная себестоимость товаров на складе

  // Данные для отображения
  lowStockProducts: Product[] = [];
  topSellingProducts: TopSellingProduct[] = [];
  recentSales: Sale[] = [];

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private loadingController: LoadingController,
    private toastService: ToastService,
  ) {
    addIcons({refresh})
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Загрузка аналитики...'
    });
    await loading.present();

    try {
      await Promise.all([
        this.loadProducts(),
        this.loadSales()
      ]);
      this.calculateAnalytics();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      this.toastService.error('Ошибка загрузки данных');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshData(event?: any) {
    await this.loadData();
    if (event) {
      event.target.complete();
    }
  }

  async loadProducts() {
    this.products = await this.productService.list().toPromise() || [];
  }

  async loadSales() {
    this.sales = await this.saleService.list().toPromise() || [];
    this.filteredSales = [...this.sales];
  }

  filterByDate() {
    if (!this.dateFrom && !this.dateTo) {
      this.filteredSales = [...this.sales];
    } else {
      this.filteredSales = this.sales.filter(sale => {
        if (!sale.created_at) return false;
        const saleDate = new Date(sale.created_at);
        const from = this.dateFrom ? new Date(this.dateFrom) : null;
        const to = this.dateTo ? new Date(this.dateTo) : null;

        if (from && to) {
          return saleDate >= from && saleDate <= to;
        } else if (from) {
          return saleDate >= from;
        } else if (to) {
          return saleDate <= to;
        }
        return true;
      });
    }
    this.calculateAnalytics();
  }

  resetDateFilter() {
    this.dateFrom = '';
    this.dateTo = '';
    this.filteredSales = [...this.sales];
    this.calculateAnalytics();
  }

  calculateAnalytics() {
    // Общая статистика
    this.totalProducts = this.products.length;
    this.totalSales = this.filteredSales.length;
    console.warn(this.filteredSales)
    this.totalRevenue = this.filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    // Расчет актуальной себестоимости товаров на складе (buy_price * quantity)
    this.currentStockValue = this.products.reduce((sum, product) => {
      return sum + (product.buy_price * product.quantity);
    }, 0);

    // Расчет себестоимости проданных товаров (сумма buy_price проданных товаров)
    this.totalCost = this.filteredSales.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((itemSum, item) => {
        return itemSum + (item.quantity * item.buy_price);
      }, 0);
      return sum + saleCost;
    }, 0);

    this.notPaidSales = this.filteredSales.reduce((sum, sale) => {
      let saleCost = 0;
      if (!sale.paid) {
        saleCost = sale.items.reduce((itemSum, item) => {
          return itemSum + (item.quantity * item.buy_price);
        }, 0);
      }
      return sum + saleCost;
    }, 0);
    console.warn(this.totalCost)

    // Расчет прибыли
    this.totalProfit = this.filteredSales.reduce((sum, sale) => {
      const saleProfit = sale.items.reduce((itemSum, item) => {
        const product = this.products.find(p => p.id === item.product_id);
        if (product) {
          return itemSum + (item.quantity * (item.sell_price - product.buy_price));
        }
        return itemSum;
      }, 0);
      return sum + saleProfit;
    }, 0);

    // Расчет реальной прибыли
    this.currentProfit = this.filteredSales.reduce((sum, sale) => {
      let saleProfit = 0;
      if (sale.paid) {
        saleProfit = sale.items.reduce((itemSum, item) => {
          const product = this.products.find(p => p.id === item.product_id);
          if (product) {
            return itemSum + (item.quantity * (item.sell_price - product.buy_price));
          }
          return itemSum;
        }, 0);
      }
      return sum + saleProfit;
    }, 0);

    // Товары с низким остатком (менее 5 штук)
    this.lowStockProducts = this.products
      .filter(p => p.quantity <= 5)
      .sort((a, b) => a.quantity - b.quantity);

    // Топ продаваемых товаров
    this.calculateTopSellingProducts();

    // Последние продажи (последние 5)
    this.recentSales = this.filteredSales
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  }

  calculateTopSellingProducts() {
    const productSales: { [key: string]: { name: string; totalSold: number; revenue: number } } = {};

    this.filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = {
            name: item.name || 'Неизвестный товар',
            totalSold: 0,
            revenue: 0
          };
        }
        productSales[item.product_id].totalSold += item.quantity;
        productSales[item.product_id].revenue += item.quantity * item.sell_price;
      });
    });

    this.topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }
}
