import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale.model';
import { SaleViewModalComponent } from "./sale-view-modal/sale-view-modal.component";
import { EditCommentModalComponent } from './edit-comment-modal/edit-comment-modal.component';
import { ReturnItemsModalComponent } from  './return-items-modal/return-items-modal.component';
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { add, eye, cashOutline, trash, createOutline, arrowUndoOutline } from "ionicons/icons";
import { UserRole } from "../../models/user-role";
import { AuthService } from "../../services/auth.service";
import { SaleModalComponent } from './sale-modal/sale-modal.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  standalone: false,
})
export class SalesPage implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  searchTerm: string = '';

  constructor(
    private saleService: SaleService,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    addIcons({add, eye, cashOutline, trash, createOutline, arrowUndoOutline})
  }

  public get isAdmin() {
    return this.authService.hasRole(UserRole.Admin)
  }

  ngOnInit() {
    this.loadSales();
  }

  async loadSales() {
    const loading = await this.loadingController.create({
      message: 'Загрузка продаж...'
    });
    await loading.present();

    try {
      this.sales = await this.saleService.list().toPromise() || [];
      this.filteredSales = [...this.sales];
    } catch (error) {
      console.error('Ошибка загрузки продаж:', error);
      this.toastService.error('Ошибка загрузки продаж');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshSales(event: any) {
    await this.loadSales();
    event.target.complete();
  }

  filterSales() {
    if (!this.searchTerm) {
      this.filteredSales = [...this.sales];
    } else {
      this.filteredSales = this.sales.filter(sale =>
        sale.customer_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (sale.comment && sale.comment.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  async createNewSale() {
    const modal = await this.modalController.create({
      component: SaleModalComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadSales();
      }
    });

    return await modal.present();
  }

  async viewSaleDetails(sale: Sale) {
    const modal = await this.modalController.create({
      component: SaleViewModalComponent,
      componentProps: {
        header: `Продажа #${sale.id}`,
        message: this.formatSaleDetails(sale),
        buttons: ['Закрыть'],
      },
      cssClass: 'custom-alert-modal',
    });
    await modal.present()
    await modal.onDidDismiss();

  }

  async checkPaidSale(sale: Sale) {
    const alert = await this.alertController.create({
      header: 'Оплата заказа',
      message: `Вы уверены, что клиент "${sale.customer_name}" оплатил заказ?`,
      buttons: [
        {
          text: 'НЕТ',
          role: 'cancel'
        },
        {
          text: 'ДА',
          role: 'yes',
          handler: () => {
            this.paidSale(sale.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteSale(sale: Sale) {
    const alert = await this.alertController.create({
      header: 'Удалить продажу',
      message: `Вы уверены, что хотите удалить продажу клиенту "${sale.customer_name}"?`,
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Удалить',
          role: 'destructive',
          handler: () => {
            this.removeSale(sale.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async removeSale(id: number) {
    const loading = await this.loadingController.create({
      message: 'Удаление продажи...'
    });
    await loading.present();

    try {
      await this.saleService.remove(id).toPromise();
      this.toastService.success('Продажа успешно удалена');
      await this.loadSales();
    } catch (error) {
      console.error('Ошибка удаления продажи:', error);
      this.toastService.error('Ошибка удаления продажи');
    } finally {
      await loading.dismiss();
    }
  }

  async paidSale(id: number) {
    const loading = await this.loadingController.create({
      message: 'Оплата заказа...'
    });
    await loading.present();

    try {
      await this.saleService.paid(id).toPromise();
      this.toastService.success('Оплата успешно завершена');
      await this.loadSales();
    } catch (error) {
      console.error('Ошибка оплаты заказа:', error);
      this.toastService.error('Ошибка оплаты заказа');
    } finally {
      await loading.dismiss();
    }
  }

  async editComment(sale: Sale) {
    const modal = await this.modalController.create({
      component: EditCommentModalComponent,
      componentProps: {
        saleId: sale.id,
        currentComment: sale.comment || ''
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadSales();
      }
    });
    await modal.present();
  }

  async returnItems(sale: Sale) {
    const modal = await this.modalController.create({
      component: ReturnItemsModalComponent,
      componentProps: {
        sale: sale
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadSales();
      }
    });
    await modal.present();
  }

  formatSaleDetails(sale: Sale): string {
    let details = `Продажа #${sale.id}\n\n`;
    details += `Клиент: ${sale.customer_name}\n`;
    details += `Дата: ${sale.created_at ? new Date(sale.created_at).toLocaleString('ru-RU') : 'Не указана'}\n`;
    details += `Комментарий: ${sale.comment || 'Нет'}\n\n`;
    details += '<b>Товары:</b>\n';

    sale.items.forEach((item, index) => {
      details += `${index + 1}. ${item.name}\n`;
      details += `&nbsp;&nbsp;&nbsp; Количество: ${item.quantity} шт.\n`;
      details += `&nbsp;&nbsp;&nbsp; Цена: ${item.sell_price.toFixed(2)} c.\n`;
      details += `&nbsp;&nbsp;&nbsp; Сумма: ${(item.quantity * item.sell_price).toFixed(2)} c.\n\n`;
    });

    details += `Итого: ${sale.total?.toFixed(2) || '0.00'} c.`;

    if (sale.returns?.length) {
      let returnsTotal = 0
      details += '\n\n <b>Возвращенные товары:</b>\n';
      sale.returns?.forEach((item, index) => {
        const summa = (item.quantity * item.refund_amount).toFixed(2);
        details += `${index + 1}. ${item.product_name}\n`;
        details += `&nbsp;&nbsp;&nbsp; Количество: ${item.quantity} шт.\n`;
        details += `&nbsp;&nbsp;&nbsp; Цена: ${item.refund_amount.toFixed(2)} c.\n`;
        details += `&nbsp;&nbsp;&nbsp; Сумма: ${summa} c.\n`;
        details += `&nbsp;&nbsp;&nbsp; Дата возврата: ${sale.created_at ? new Date(sale.created_at).toLocaleString('ru-RU') : 'Не указана'}\n`;
        if (item.comment?.length) {
          details += `&nbsp;&nbsp;&nbsp; Причина возврата: ${item.comment}\n`;
        }
        returnsTotal += +summa;
      });

      details += `\nИтого: ${returnsTotal.toFixed(2) || '0.00'} c.`;
    }

    return details;
  }
}
