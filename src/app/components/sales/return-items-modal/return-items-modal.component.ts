import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Sale, SaleItem, SaleReturnLine } from '../../../models/sale.model';
import { SaleService } from '../../../services/sale.service';
import { ToastService } from '../../../services/toast.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-return-items-modal',
  templateUrl: './return-items-modal.component.html',
  styleUrls: ['./return-items-modal.component.scss'],
  standalone: false,
})
export class ReturnItemsModalComponent implements OnInit {
  @Input() sale!: Sale;

  lines: SaleReturnLine[] = [];
  comment: string = '';

  constructor(
    private modalCtrl: ModalController,
    private saleService: SaleService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
  ) {
    addIcons({ close })
  }

  ngOnInit() {
    this.lines = (this.sale.items || []).map((i: SaleItem) => ({
      product_id: i.product_id,
      name: i.name,
      max: i.quantity,
      qty: 0,
      selected: false,
      comment: '',
    }));
  }

  get canSubmit(): boolean {
    return this.lines.some(l => l.selected && l.qty > 0 && l.qty <= l.max);
  }

  clamp(line: SaleReturnLine) {
    if (line.qty < 0) line.qty = 0;
    if (line.qty > line.max) line.qty = line.max;
  }

  async submit() {
    if (!this.canSubmit) return;
    const loading = await this.loadingCtrl.create({ message: 'Оформление возврата...' });
    await loading.present();
    try {
      const items = this.lines
        .filter(l => l.selected && l.qty > 0)
        .map(l => ({ product_id: l.product_id, quantity: l.qty, comment: l.comment }));
      await this.saleService.returnItems(this.sale.id!, { items, comment: this.comment.trim() || undefined }).toPromise();
      this.toast.success('Возврат оформлен');
      this.dismiss(true);
    } catch (e) {
      console.error(e);
      this.toast.error('Не удалось оформить возврат');
    } finally {
      await loading.dismiss();
    }
  }

  dismiss(updated: boolean = false) {
    this.modalCtrl.dismiss(updated);
  }
}
