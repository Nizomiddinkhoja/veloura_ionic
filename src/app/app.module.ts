import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServicesModule } from './services/services.module';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { appInterceptor } from "./app.interceptor";
import { provideIonicAngular } from "@ionic/angular/standalone";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServicesModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([appInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
