import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { User } from "../models/user.model";
import { StorageService } from "./storage.service";
import { ApiService } from "./api.service";
import { UserRole } from "../models/user-role";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  user!: User | null;

  constructor(
    private api: ApiService,
    private storageService: StorageService,
    private readonly router: Router,
  ) {
  }

  login(email: string, password: string): Observable<any> {
    return this.api.post(`/login`, {email, password});
  }

  logout() {
    this.user = null
    this.storageService.removeItem('auth-token')
    this.router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getItem('auth-token');
  }

  getCurrentUser(useCache = false): Observable<User> {
    if (useCache && this.user) {
      return of(this.user)
    }

    return this.api.get<User>('/me')
      .pipe(tap(user => {
        this.user = user
      }))
  }

  hasRole(data: UserRole[] | UserRole) {
    const roles = (Array.isArray(data) ? data : [data]) as UserRole[]
    return this.user && roles.includes(this.user.role)
  }
}
