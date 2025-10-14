import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { ProductService } from './product.service';
import { SaleService } from './sale.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ApiService,
    ProductService,
    SaleService
  ]
})
export class ServicesModule { }

