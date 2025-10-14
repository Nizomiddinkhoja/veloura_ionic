import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import { close, shareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sale-view-modal',
  templateUrl: './sale-view-modal.component.html',
  styleUrls: ['./sale-view-modal.component.scss'],
  standalone: false
})
export class SaleViewModalComponent {
  @Input() header!: string;
  @Input() message!: string;
  @Input() buttons: string[] = ['OK'];

  constructor(private modalCtrl: ModalController) {
    addIcons({close, shareOutline})
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async share() {
    try {
      // Убираем HTML теги для текстового формата
      const plainText = this.message
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '');

      await Share.share({
        title: this.header,
        text: plainText,
        dialogTitle: 'Поделиться информацией о продаже'
      });
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
    }
  }
}
