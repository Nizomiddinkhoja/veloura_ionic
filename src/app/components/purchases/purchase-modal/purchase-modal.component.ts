import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Purchase, PurchaseItem, Dealer } from '../../../models/purchase.model';
import { Product } from '../../../models/product.model';
import { PurchaseService } from '../../../services/purchase.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
  standalone: false,
})
export class PurchaseModalComponent implements OnInit {
  @Input() purchase?: Purchase;

  formData: any = {
    dealer_id: null,
    dealer_name: '',
    items: [],
    total_amount: 0,
    status: 'completed',
    notes: ''
  };

  // Текущий товар для добавления
  currentItem: any = {
    product_id: null,
    product_name: '',
    quantity: 0,
    buy_price: 0,
    sell_price: 0,
    total_cost: 0,
    is_return: false
  };


  // Автокомплит
  dealerSearchTerm: string = '';
  productSearchTerm: string = '';
  dealerSuggestions: Dealer[] = [];
  productSuggestions: Product[] = [];
  showDealerSuggestions: boolean = false;
  showProductSuggestions: boolean = false;

  private dealerSearch$ = new Subject<string>();
  private productSearch$ = new Subject<string>();

  constructor(
    private modalController: ModalController,
    private purchaseService: PurchaseService
  ) {
  }

  ngOnInit() {
    this.formData.dealer_id = 1;
    if (this.purchase) {
      this.formData = {...this.purchase};
      this.dealerSearchTerm = this.purchase.dealer_name;
    }

    // Настройка автокомплита для дилеров
    this.dealerSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.purchaseService.searchDealers(term))
    ).subscribe(dealers => {
      this.dealerSuggestions = dealers;
      this.showDealerSuggestions = dealers.length > 0;
    });

    // Настройка автокомплита для товаров
    this.productSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.purchaseService.searchProducts(term))
    ).subscribe(products => {
      this.productSuggestions = products;
      this.showProductSuggestions = products.length > 0;
    });
  }

  // Автокомплит дилеров
  onDealerInput(event: any) {
    const value = event.target.value;
    this.dealerSearchTerm = value;
    // Сбрасываем ID при ручном вводе
    this.formData.dealer_id = null;
    this.formData.dealer_name = value;

    if (value && value.length >= 2) {
      this.dealerSearch$.next(value);
    } else {
      this.showDealerSuggestions = false;
    }
  }

  selectDealer(dealer: Dealer) {
    this.formData.dealer_id = dealer.id;
    this.formData.dealer_name = dealer.name;
    this.dealerSearchTerm = dealer.name;
    this.showDealerSuggestions = false;
  }

  // Автокомплит товаров
  onProductInput(event: any) {
    const value = event.target.value;
    this.productSearchTerm = value;
    // Сбрасываем ID при ручном вводе
    this.currentItem.product_id = null;
    this.currentItem.product_name = value;

    if (value && value.length >= 2) {
      this.productSearch$.next(value);
    } else {
      this.showProductSuggestions = false;
    }
  }

  selectProduct(product: Product) {
    this.currentItem.product_id = product.id;
    this.currentItem.product_name = product.name;
    this.currentItem.buy_price = product.buy_price;
    this.currentItem.sell_price = product.sell_price;
    this.productSearchTerm = product.name;
    this.showProductSuggestions = false;
    this.calculateItemTotal();
  }

  // Расчет стоимости текущего товара
  calculateItemTotal() {
    const quantity = parseFloat(this.currentItem.quantity) || 0;
    const buyPrice = parseFloat(this.currentItem.buy_price) || 0;
    this.currentItem.total_cost = quantity * buyPrice;
  }

  // Добавить товар в список
  addItem() {
    // Если не выбран из списка, используем значение из инпута
    if (!this.currentItem.product_name && this.productSearchTerm) {
      this.currentItem.product_name = this.productSearchTerm;
    }

    if (!this.currentItem.product_name || !this.currentItem.quantity || !this.currentItem.buy_price) {
      return;
    }

    const item: PurchaseItem = {
      product_id: this.currentItem.product_id,
      product_name: this.currentItem.product_name,
      quantity: parseFloat(this.currentItem.quantity),
      buy_price: parseFloat(this.currentItem.buy_price),
      sell_price: parseFloat(this.currentItem.sell_price),
      total_cost: this.currentItem.total_cost,
      is_return: this.currentItem.is_return
    };

    this.formData.items.push(item);
    this.calculateTotalAmount();
    this.resetCurrentItem();
  }

  // Удалить товар из списка
  removeItem(index: number) {
    this.formData.items.splice(index, 1);
    this.calculateTotalAmount();
  }

  // Сбросить текущий товар
  resetCurrentItem() {
    this.currentItem = {
      product_id: null,
      product_name: '',
      quantity: 0,
      buy_price: 0,
      sell_price: 0,
      total_cost: 0,
      is_return: false
    };
    this.productSearchTerm = '';
  }

  // Расчет общей суммы закупки
  calculateTotalAmount() {
    this.formData.total_amount = this.formData.items.reduce((sum: number, item: PurchaseItem) => {
      return sum + (item.is_return ? -item.total_cost : item.total_cost);
    }, 0);
  }


  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    if (this.formData.items.length === 0) {
      return;
    }

    const purchase: Purchase = {
      dealer_id: this.formData.dealer_id,
      dealer_name: this.formData.dealer_name,
      items: this.formData.items,
      total_amount: parseFloat(this.formData.total_amount),
      status: this.formData.status,
      notes: this.formData.notes
    };

    this.modalController.dismiss(purchase);
  }
}
