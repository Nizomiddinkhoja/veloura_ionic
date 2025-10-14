import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { SaleService } from '../../../services/sale.service';
import { ToastService } from '../../../services/toast.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-edit-comment-modal',
  templateUrl: './edit-comment-modal.component.html',
  styleUrls: ['./edit-comment-modal.component.scss'],
  standalone: false,
})
export class EditCommentModalComponent {
  @Input() saleId!: number;
  @Input() currentComment: string = '';

  comment: string = '';

  constructor(
    private modalCtrl: ModalController,
    private saleService: SaleService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
  ) {
      addIcons({close})
    }

  ngOnInit() {
    this.comment = this.currentComment || '';
  }

  async save() {
    const loading = await this.loadingCtrl.create({ message: 'Обновление комментария...' });
    await loading.present();
    try {
      await this.saleService.updateComment(this.saleId, this.comment.trim()).toPromise();
      this.toast.success('Комментарий обновлён');
      this.dismiss(true);
    } catch (e) {
      console.error(e);
      this.toast.error('Не удалось обновить комментарий');
    } finally {
      await loading.dismiss();
    }
  }

  dismiss(updated: boolean = false) {
    this.modalCtrl.dismiss(updated);
  }
}
