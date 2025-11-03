import { Component, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from "../../services/storage.service";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


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
    private readonly destroyRef: DestroyRef,
    ) {
  }


  login() {
    if (!this.email || !this.password) {
      alert('Введите email и пароль');
      return;
    }
    this.loading = true;
    this.auth.login(this.email, this.password)
      .pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
      next: (res) => {
        if (res?.token) {
          this.storageService.setItem('auth-token', res.token);
          this.router.navigateByUrl('/home');
        } else {
          alert('Ошибка авторизации');
        }
      },
      error: () => {
        alert('Неверные учетные данные');
      }
    });
  }
}
