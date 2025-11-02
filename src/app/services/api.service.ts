import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ApiService {
// Замените на ваш URL бэкенда
  base = '';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`, { params });
  }
  post<T>(path: string, body: any): Observable<T> { return this.http.post<T>(`${this.base}${path}`, body); }
  patch<T>(path: string, body: any): Observable<T> { return this.http.patch<T>(`${this.base}${path}`, body); }
  put<T>(path: string, body: any): Observable<T> { return this.http.put<T>(`${this.base}${path}`, body); }
  delete<T>(path: string): Observable<T> { return this.http.delete<T>(`${this.base}${path}`); }
}
