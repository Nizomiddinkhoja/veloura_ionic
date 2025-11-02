import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasesPageRoutingModule } from './purchases-routing.module';

import { PurchasesPage } from './purchases.page';
import { PurchaseModalComponent } from './purchase-modal/purchase-modal.component';
import { PurchaseViewModalComponent } from './purchase-view-modal/purchase-view-modal.component';
import { PurchasesFilterModalComponent } from './purchases-filter-modal/purchases-filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasesPageRoutingModule
  ],
  declarations: [
    PurchasesPage,
    PurchaseModalComponent,
    PurchaseViewModalComponent,
    PurchasesFilterModalComponent
  ]
})
export class PurchasesPageModule {}
