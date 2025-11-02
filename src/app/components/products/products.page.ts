import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { add, create, trash, filterOutline } from "ionicons/icons";
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductsFilterModalComponent, ProductsFilters } from './products-filter-modal/products-filter-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  currentFilters: ProductsFilters = {};

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private modalController: ModalController,
  ) {
    addIcons({add, trash, create, filterOutline})
  }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    const loading = await this.loadingController.create({
      message: 'Загрузка продуктов...'
    });
    await loading.present();

    try {
      this.products = await this.productService.list(this.currentFilters).toPromise() || [];
      this.filteredProducts = [...this.products];
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      this.toastService.error('Ошибка загрузки продуктов');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshProducts(event: any) {
    await this.loadProducts();
    event.target.complete();
  }

  filterProducts() {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async openProductModal(product?: Product) {
    const modal = await this.modalController.create({
      component: ProductModalComponent,
      componentProps: {
        product,
      },
    });

    await modal.present();

    const {data} = await modal.onWillDismiss<Product>();
    if (data) {
      if (data.name && data.buy_price && data.sell_price && data.quantity) {
        if (product) {
          this.updateProduct(product.id!, data);
        } else {
          this.createProduct(data);
        }
      } else {
        this.toastService.warning('Заполните все поля');
      }
    }
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Удалить продукт',
      message: `Вы уверены, что хотите удалить продукт "${product.name}"?`,
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Удалить',
          role: 'destructive',
          handler: () => {
            this.removeProduct(product.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async createProduct(data: any) {
    const loading = await this.loadingController.create({
      message: 'Создание продукта...'
    });
    await loading.present();

    try {
      const newProduct: Product = {
        name: data.name,
        buy_price: parseFloat(data.buy_price),
        sell_price: parseFloat(data.sell_price),
        quantity: parseInt(data.quantity),
        created_at: new Date().toISOString(),
        added_at: [new Date().toISOString()]
      };

      await this.productService.create(newProduct).toPromise();
      this.toastService.success('Продукт успешно добавлен');
      await this.loadProducts();
    } catch (error) {
      console.error('Ошибка создания продукта:', error);
      this.toastService.error('Ошибка создания продукта');
    } finally {
      await loading.dismiss();
    }
  }

  async updateProduct(id: number, data: any) {
    const loading = await this.loadingController.create({
      message: 'Обновление продукта...'
    });
    await loading.present();

    try {
      const updatedProduct: Partial<Product> = {
        name: data.name,
        buy_price: parseFloat(data.buy_price),
        sell_price: parseFloat(data.sell_price),
        quantity: parseInt(data.quantity)
      };

      await this.productService.update(id, updatedProduct).toPromise();
      this.toastService.success('Продукт успешно обновлен');
      await this.loadProducts();
    } catch (error) {
      console.error('Ошибка обновления продукта:', error);
      this.toastService.error('Ошибка обновления продукта');
    } finally {
      await loading.dismiss();
    }
  }

  async removeProduct(id: number) {
    const loading = await this.loadingController.create({
      message: 'Удаление продукта...'
    });
    await loading.present();

    try {
      await this.productService.remove(id).toPromise();
      this.toastService.success('Продукт успешно удален');
      await this.loadProducts();
    } catch (error) {
      console.error('Ошибка удаления продукта:', error);
      this.toastService.error('Ошибка удаления продукта');
    } finally {
      await loading.dismiss();
    }
  }

  // Открыть модалку фильтров
  async openFilters() {
    const modal = await this.modalController.create({
      component: ProductsFilterModalComponent,
      componentProps: {
        currentFilters: this.currentFilters
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<ProductsFilters>();
    if (data) {
      this.currentFilters = data;
      await this.loadProducts();
    }
  }
}
