import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductsFilterModalComponent } from './products-filter-modal/products-filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage, ProductModalComponent, ProductsFilterModalComponent]
})
export class ProductsPageModule {}
