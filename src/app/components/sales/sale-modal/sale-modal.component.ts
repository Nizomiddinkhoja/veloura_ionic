import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons'
import { close, trash } from 'ionicons/icons'
import { Product } from 'src/app/models/product.model';
import { Sale, SaleItem } from 'src/app/models/sale.model';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sale-modal',
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.scss'],
  standalone: false,
})
export class SaleModalComponent implements OnInit {
  availableProducts: Product[] = [];
  selectedProductId: number | null = null;
  selectedProduct: Product | null = null;
  quantity: number = 1;
  sellPrice: number = 0;
  buyPrice: number = 0;
  customerName: string = '';
  comment: string = '';
  cartItems: SaleItem[] = [];
  paid: boolean = false; // статус оплаты

  constructor(
    private modalController: ModalController,
    private productService: ProductService,
    private saleService: SaleService,
    private toastService: ToastService,
    private loadingController: LoadingController
  ) {
    addIcons({close, trash})
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.availableProducts = await this.productService.list().toPromise() || [];
      this.availableProducts = this.availableProducts.filter(p => p.quantity > 0);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      this.toastService.error('Ошибка загрузки продуктов');
    }
  }

  onProductSelected() {
    if (this.selectedProductId) {
      this.selectedProduct = this.availableProducts.find(p => p.id === this.selectedProductId) || null;
      if (this.selectedProduct) {
        this.sellPrice = this.selectedProduct.sell_price;
        this.buyPrice = this.selectedProduct.buy_price;
        this.quantity = 1;
      }
    } else {
      this.selectedProduct = null;
    }
  }

  canAddToCart(): boolean {
    return !!(
      this.selectedProduct &&
      this.quantity > 0 &&
      this.quantity <= this.selectedProduct.quantity &&
      this.sellPrice >= this.selectedProduct.buy_price
    );
  }

  addToCart() {
    if (!this.selectedProduct || !this.canAddToCart()) return;

    const existingItemIndex = this.cartItems.findIndex(item => item.product_id === this.selectedProduct!.id);

    if (existingItemIndex >= 0) {
      this.cartItems[existingItemIndex].quantity += this.quantity;
    } else {
      this.cartItems.push({
        product_id: this.selectedProduct.id!,
        name: this.selectedProduct.name,
        quantity: this.quantity,
        sell_price: this.sellPrice,
        buy_price: this.buyPrice
      });
    }

    // Обновляем остаток продукта
    this.selectedProduct.quantity -= this.quantity;

    // Сбрасываем форму
    this.selectedProductId = null;
    this.selectedProduct = null;
    this.quantity = 1;
    this.sellPrice = 0;
  }

  removeFromCart(index: number) {
    const item = this.cartItems[index];
    const product = this.availableProducts.find(p => p.id === item.product_id);

    if (product) {
      product.quantity += item.quantity;
    }

    this.cartItems.splice(index, 1);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.quantity * item.sell_price), 0);
  }

  canCreateSale(): boolean {
    return this.customerName.trim().length > 0 && this.cartItems.length > 0;
  }

  async createSale() {
    if (!this.canCreateSale()) return;

    const loading = await this.loadingController.create({
      message: 'Создание продажи...'
    });
    await loading.present();

    try {
      const sale: Sale = {
        customer_name: this.customerName.trim(),
        comment: this.comment.trim() || undefined,
        items: [...this.cartItems],
        total: this.getTotalAmount(),
        paid: this.paid,
        created_at: new Date().toISOString()
      };

      await this.saleService.create(sale).toPromise();
      this.toastService.success('Продажа успешно оформлена');
      this.dismiss(true);
    } catch (error) {
      console.error('Ошибка создания продажи:', error);
      this.toastService.error('Ошибка создания продажи');
    } finally {
      await loading.dismiss();
    }
  }

  dismiss(created: boolean = false) {
    this.modalController.dismiss(created);
  }
}
