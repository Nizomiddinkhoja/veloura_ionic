import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from "../../services/storage.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;


  constructor(
    private auth: AuthService,
    private router: Router,
    private storageService: StorageService,
    ) {
  }


  login() {
    if (!this.email || !this.password) {
      alert('Введите email и пароль');
      return;
    }
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.token) {
          this.storageService.setItem('auth-token', res.token);
          this.router.navigateByUrl('/home');
        } else {
          alert('Ошибка авторизации');
        }
      },
      error: () => {
        this.loading = false;
        alert('Неверные учетные данные');
      }
    });
  }
}
