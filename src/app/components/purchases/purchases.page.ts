import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { PurchaseService } from '../../services/purchase.service';
import { Purchase } from '../../models/purchase.model';
import { ToastService } from '../../services/toast.service';
import { addIcons } from 'ionicons';
import { add, create, trash, wallet, eye, shareSocial, filterOutline } from 'ionicons/icons';
import { PurchaseModalComponent } from './purchase-modal/purchase-modal.component';
import { PurchaseViewModalComponent } from './purchase-view-modal/purchase-view-modal.component';
import { PurchasesFilterModalComponent, PurchasesFilters } from './purchases-filter-modal/purchases-filter-modal.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
  standalone: false,
})
export class PurchasesPage implements OnInit {
  purchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  searchTerm: string = '';
  currentFilters: PurchasesFilters = {};

  constructor(
    private purchaseService: PurchaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private modalController: ModalController
  ) {
    addIcons({add, trash, create, wallet, eye, shareSocial, filterOutline});
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Загрузка данных...'
    });
    await loading.present();

    try {
      await this.loadPurchases();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      this.toastService.error('Ошибка загрузки данных');
    } finally {
      await loading.dismiss();
    }
  }

  async loadPurchases() {
    try {
      this.purchases = await this.purchaseService.listPurchases(this.currentFilters).toPromise() || [];
      this.filteredPurchases = [...this.purchases];
    } catch (error) {
      console.error('Ошибка загрузки закупок:', error);
    }
  }


  async refreshData(event: any) {
    await this.loadData();
    event.target.complete();
  }

  filterPurchases() {
    if (!this.searchTerm) {
      this.filteredPurchases = [...this.purchases];
    } else {
      this.filteredPurchases = this.purchases.filter(purchase =>
        purchase.dealer_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        purchase.items.some(item => item.product_name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }


  async openPurchaseModal(purchase?: Purchase) {
    const modal = await this.modalController.create({
      component: PurchaseModalComponent,
      componentProps: {
        purchase
      }
    });
    await modal.present();

    modal.onDidDismiss().then(() => {
      this.loadData();
    });
  }

  async deletePurchase(purchase: Purchase) {
    const itemNames = purchase.items.map(item => item.product_name).join(', ');
    const alert = await this.alertController.create({
      header: 'Удалить закупку',
      message: `Вы уверены, что хотите удалить закупку "${itemNames}"?`,
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Удалить',
          role: 'destructive',
          handler: async () => {
            await this.removePurchase(purchase.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async removePurchase(id: number) {
    const loading = await this.loadingController.create({
      message: 'Удаление закупки...'
    });
    await loading.present();

    try {
      await this.purchaseService.deletePurchase(id).toPromise();
      this.toastService.success('Закупка успешно удалена');
      await this.loadData();
    } catch (error) {
      console.error('Ошибка удаления закупки:', error);
      this.toastService.error('Ошибка удаления закупки');
    } finally {
      await loading.dismiss();
    }
  }


  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'pending':
        return 'Ожидание';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'medium';
    }
  }

  // Подсчет количества закупок (не возвратов)
  getPurchaseItemsCount(purchase: Purchase): number {
    return purchase.items.filter(item => !item.is_return).length;
  }

  // Подсчет количества возвратов
  getReturnItemsCount(purchase: Purchase): number {
    return purchase.items.filter(item => item.is_return).length;
  }

  // Просмотр деталей закупки
  async viewPurchaseDetails(purchase: Purchase) {
    const purchaseItems = purchase.items.filter(item => !item.is_return);
    const returnItems = purchase.items.filter(item => item.is_return);

    // HTML сообщение для отображения
    let message = `<h2>👤 Поставщик: ${purchase.dealer_name}</h2>`;
    message += `<p>📅 ${new Date(purchase.created_at || '').toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>`;

    if (purchaseItems.length > 0) {
      message += '<h2>🛒 Закупки</h2>';
      purchaseItems.forEach(item => {
        message += '<div class="item">';
        message += `<p><strong>${item.product_name}</strong></p>`;
        message += `<p>${item.quantity} шт. × ${item.buy_price.toFixed(2)} = <strong>${item.total_cost.toFixed(2)} сом.</strong></p>`;
        message += `<p style="color: var(--ion-color-success)">💰 Цена продажи: ${item.sell_price.toFixed(2)} сом.</p>`;
        message += '</div>';
        message += '<hr>';
      });
    }

    if (returnItems.length > 0) {
      message += '<h2>↩️ Возвраты</h2>';
      returnItems.forEach(item => {
        message += '<div class="item">';
        message += `<p><strong>${item.product_name}</strong></p>`;
        message += `<p>${item.quantity} шт. × ${item.buy_price.toFixed(2)} = <strong>${item.total_cost.toFixed(2)} сом.</strong></p>`;
        message += '</div>';
        message += '<hr>';
      });
    }

    message += `<div class="total"><p>💵 Итого: ${purchase.total_amount.toFixed(2)} сом.</p></div>`;

    if (purchase.notes) {
      message += `<p style="margin-top: 16px; font-style: italic; color: var(--ion-color-medium)">📝 Заметки: ${purchase.notes}</p>`;
    }

    // Текст для шеринга
    const shareText = this.generateShareText(purchase);

    const modal = await this.modalController.create({
      component: PurchaseViewModalComponent,
      componentProps: {
        header: 'Детали закупки',
        message: message,
        shareText: shareText
      }
    });

    await modal.present();
  }

  // Генерация текста для шеринга
  generateShareText(purchase: Purchase): string {
    const purchaseItems = purchase.items.filter(item => !item.is_return);
    const returnItems = purchase.items.filter(item => item.is_return);

    let text = `📦 Закупка от ${purchase.dealer_name}\n`;
    text += `📅 ${new Date(purchase.created_at || '').toLocaleDateString('ru-RU')}\n\n`;

    if (purchaseItems.length > 0) {
      text += '🛒 Закупки:\n';
      purchaseItems.forEach(item => {
        text += `• ${item.product_name} - ${item.quantity} шт. × ${item.buy_price.toFixed(2)} = ${item.total_cost.toFixed(2)} сом.\n`;
        text += `  💰 Цена продажи: ${item.sell_price.toFixed(2)} сом.\n`;
      });
      text += '\n';
    }

    if (returnItems.length > 0) {
      text += '↩️ Возвраты:\n';
      returnItems.forEach(item => {
        text += `• ${item.product_name} - ${item.quantity} шт. × ${item.buy_price.toFixed(2)} = ${item.total_cost.toFixed(2)} сом.\n`;
      });
      text += '\n';
    }

    text += `💵 Итого: ${purchase.total_amount.toFixed(2)} сом.`;

    if (purchase.notes) {
      text += `\n\n📝 Заметки: ${purchase.notes}`;
    }

    return text;
  }

  // Открыть модалку фильтров
  async openFilters() {
    const modal = await this.modalController.create({
      component: PurchasesFilterModalComponent,
      componentProps: {
        currentFilters: this.currentFilters
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<PurchasesFilters>();
    if (data) {
      this.currentFilters = data;
      await this.loadData();
    }
  }
}
