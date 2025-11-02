import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons'
import { cardOutline, cubeOutline, analyticsOutline, clipboardOutline, cartOutline } from 'ionicons/icons'
import { AuthService } from "../../services/auth.service";
import { UserRole } from "../../models/user-role";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    addIcons({cardOutline, cubeOutline, analyticsOutline, clipboardOutline, cartOutline});
  }

  public get isAdmin() {
    return this.authService.hasRole(UserRole.Admin)
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToSales() {
    this.router.navigate(['/sales']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/analytics']);
  }

  navigateToNotes() {
    this.router.navigate(['/notes']);
  }

  navigateToPurchases() {
    this.router.navigate(['/purchases']);
  }

}
