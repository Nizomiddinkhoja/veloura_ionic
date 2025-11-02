import { Component, Input } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import { close, shareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-purchase-view-modal',
  templateUrl: './purchase-view-modal.component.html',
  styleUrls: ['./purchase-view-modal.component.scss'],
  standalone: false
})
export class PurchaseViewModalComponent {
  @Input() header!: string;
  @Input() message!: string;
  @Input() shareText!: string;

  constructor(private modalCtrl: ModalController) {
    addIcons({close, shareOutline})
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async share() {
    try {
      await Share.share({
        title: this.header,
        text: this.shareText,
        dialogTitle: 'Поделиться информацией о закупке'
      });
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
    }
  }
}
