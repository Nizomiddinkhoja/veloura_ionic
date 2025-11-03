import { Component, DestroyRef, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { add, create, trash, filterOutline } from "ionicons/icons";
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductsFilterModalComponent, ProductsFilters } from './products-filter-modal/products-filter-modal.component';
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
  isLoading = true
  private refreshEvent: any

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private modalController: ModalController,
    private readonly destroyRef: DestroyRef,
  ) {
    addIcons({add, trash, create, filterOutline})
  }

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.list(this.currentFilters)
      .pipe(
        finalize(() => {
          this.isLoading = false
          if (this.refreshEvent) {
            this.refreshEvent.target.complete()
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = [...this.products];
      },
      error: (error) => {
        console.error('Ошибка загрузки продуктов:', error);
        this.toastService.error('Ошибка загрузки продуктов');
      }
    });
  }

  onIonRefresh(event: any) {
    this.refreshEvent = event
    this.loadProducts()
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
    await modal.onDidDismiss();
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
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Удаление продукта...'
            });
            await loading.present();

            try {
              await this.productService.remove(product.id!).toPromise();
              this.toastService.success('Продукт успешно удален');
              this.loadProducts();
              return true;
            } catch (error) {
              console.error('Ошибка удаления продукта:', error);
              return false;
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
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

    const {data} = await modal.onWillDismiss<ProductsFilters>();
    if (data) {
      this.currentFilters = data;
      await this.loadProducts();
    }
  }
}
