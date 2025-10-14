import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons'
import { close } from 'ionicons/icons'
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
  standalone: false
})
export class ProductModalComponent implements OnInit {
  @Input() product!: Product;
  currentProduct!: Product;
  isUpdate: boolean = false;

  constructor(private modalCtrl: ModalController) {
    addIcons({close})
  }

  ngOnInit() {
    this.isUpdate = !!this.product;
    if (!this.isUpdate) {
      this.currentProduct = {
        name: '',
        buy_price: 0,
        sell_price: 0,
        quantity: 0,
      };
    }else{
      this.currentProduct = JSON.parse(JSON.stringify(this.product));
    }
  }

  dismiss() {
    console.warn(this.currentProduct);
    console.log(this.product);
    
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss(this.currentProduct, this.isUpdate.toString());
  }

  canSave(): boolean {
    return !!(
      this.currentProduct.name.length &&
      this.currentProduct.sell_price >= this.currentProduct.buy_price
    );
  }
}
