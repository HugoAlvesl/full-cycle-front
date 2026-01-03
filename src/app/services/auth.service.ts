import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);

      if (!payload || !payload.exp) {
        return false;
      }

      // Verifica se o token expirou
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      throw error;
    }
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, userData);
  }

}
