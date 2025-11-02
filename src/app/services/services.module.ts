import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { ProductService } from './product.service';
import { SaleService } from './sale.service';
import { PurchaseService } from './purchase.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ApiService,
    ProductService,
    SaleService,
    PurchaseService
  ]
})
export class ServicesModule { }

