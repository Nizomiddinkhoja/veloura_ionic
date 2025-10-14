import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from "./login.page";
import { LoginRoutingModule } from "./login-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
