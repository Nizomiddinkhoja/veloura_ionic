import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { catchError, map, of } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { StorageService } from "../services/storage.service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService),
    storageService = inject(StorageService);

  if (!storageService.getItem('auth-token')) {
    return false
  }

  return authService.getCurrentUser(true)
    .pipe(
      map(user => !!user),
      catchError(() => of(false)),
    )
}
