import { inject } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHeaders, HttpInterceptorFn } from '@angular/common/http'
import { environment } from '../environments/environment'
import { catchError, throwError } from 'rxjs'
import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";
import { ToastService } from "./services/toast.service";

export const appInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService)
  const storageService = inject(StorageService)
  const toastService = inject(ToastService)
  const token = storageService.getItem('auth-token')
  let headers = new HttpHeaders()

  if (request.url.indexOf('/img/upload') < 0) {
    headers = headers.append('Accept', 'application/json')
    headers = headers.append('Content-Type', 'application/json')
  }

  if (token) {
    headers = headers.append('Authorization', `Bearer ${token}`)
  }

  const resolvedReq = request.clone({
    headers,
    url: environment.apiUrl + request.url,
  })

  return next(resolvedReq)
    .pipe(
      catchError((error: HttpEvent<any>) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            authService.logout()
          }

          if (error.error.message) {
            toastService.error(error.error.message)
          }
        }

        return throwError(() => error)
      }),
    )
}
