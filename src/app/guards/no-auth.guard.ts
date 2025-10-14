import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { StorageService } from "../services/storage.service";

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router),
    storageService = inject(StorageService)

  if (!storageService.getItem('auth-token')) return true

  router.navigate(['/home'], {
    replaceUrl: true,
  })
  return false
}
