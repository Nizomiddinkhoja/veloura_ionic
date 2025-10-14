import { Injectable } from '@angular/core'

type STORAGE_KEYS = 'auth-token'

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  getItem(key: STORAGE_KEYS): any {
    try {
      const data = localStorage.getItem(key)
      return JSON.parse(<string>data)
    } catch (e) {
      return null
    }
  }

  removeItem(key: STORAGE_KEYS) {
    localStorage.removeItem(key)
  }

  setItem(key: STORAGE_KEYS, data: any): void {
    localStorage.setItem(key, JSON.stringify(data))
  }
}
