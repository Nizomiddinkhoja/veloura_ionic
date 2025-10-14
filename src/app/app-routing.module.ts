import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from "./guards/no-auth.guard";
import { authGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginPageModule),
    canActivate: [noAuthGuard],
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomePageModule),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./components/products/products.module').then(m => m.ProductsPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    loadChildren: () => import('./components/sales/sales.module').then(m => m.SalesPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    loadChildren: () => import('./components/analytics/analytics.module').then(m => m.AnalyticsPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'notes',
    loadChildren: () => import('./components/notes/notes.module').then(m => m.NotesPageModule),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
