import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons'
import { close } from 'ionicons/icons'
import { Product } from 'src/app/models/product.model';
import { ProductService } from "../../../services/product.service";
import { ToastService } from "../../../services/toast.service";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private productService: ProductService,
    private toastService: ToastService,
    private readonly destroyRef: DestroyRef,
  ) {
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
    } else {
      this.currentProduct = JSON.parse(JSON.stringify(this.product));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async save() {
    if (this.currentProduct) {
      if (this.currentProduct.name && this.currentProduct.sell_price) {
        if (this.isUpdate) {
          await this.updateProduct(this.product.id!, this.currentProduct);
        } else {
          await this.createProduct(this.currentProduct);
        }
      } else {
        this.toastService.warning('Заполните все поля');
      }
    }
  }

  canSave(): boolean {
    return !!(
      this.currentProduct.name.length && this.currentProduct.sell_price && ((this.currentProduct?.buy_price && this.currentProduct.sell_price >= this.currentProduct.buy_price) || this.currentProduct?.buy_price)
    );
  }

  async createProduct(data: any) {
    const loading = await this.loadingController.create({
      message: 'Создание продукта...'
    });
    await loading.present();

    const newProduct: Partial<Product> = {
      name: data.name,
      sell_price: parseFloat(data.sell_price),
      created_at: new Date().toISOString(),
    };

    this.productService.create(newProduct)
      .pipe(
        finalize(() => loading.dismiss()),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
      next: () => {
        this.toastService.success('Продукт успешно добавлен');
        this.modalCtrl.dismiss();
      },
      error: (error) => {
        console.error('Ошибка создания продукта:', error);
      }
    });
  }

  async updateProduct(id: number, data: any) {
    const loading = await this.loadingController.create({
      message: 'Обновление продукта...'
    });
    await loading.present();

    const updatedProduct: Partial<Product> = {
      name: data.name,
      sell_price: parseFloat(data.sell_price),
    };

    this.productService.update(id, updatedProduct)
      .pipe(
        finalize(() => loading.dismiss()),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
      next: () => {
        this.toastService.success('Продукт успешно обновлен');
        this.modalCtrl.dismiss();
      },
      error: (error) => {
        console.error('Ошибка обновления продукта:', error);
      }
    });
  }
}
