import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesPageRoutingModule } from './sales-routing.module';

import { SalesPage } from './sales.page';
import { SaleViewModalComponent } from "./sale-view-modal/sale-view-modal.component";
import { EditCommentModalComponent } from './edit-comment-modal/edit-comment-modal.component';
import { ReturnItemsModalComponent } from './return-items-modal/return-items-modal.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { SalesFilterModalComponent } from './sales-filter-modal/sales-filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesPageRoutingModule
  ],
  declarations: [SalesPage, SaleModalComponent, SaleViewModalComponent, EditCommentModalComponent, ReturnItemsModalComponent, SalesFilterModalComponent]
})
export class SalesPageModule {}
