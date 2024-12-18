import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utente } from '../interfacce/utente';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ResponseCustom } from '../interfacce/response-custom';
import { BaseService } from './base.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  url = this.baseUrl + '/auth';
  public avail: boolean = false;
  public msg: string = '';

  private isAuthenticated = false;
  private redirectUrl: string | null = null;
  private authToken: string | null = null;

  private readonly TOKEN_KEY = 'token';
  private readonly USER_DATA_KEY = 'utente';
  private readonly SESSION_EXPIRY_KEY = 'sessionExpiryData';
  private readonly SESSION_DURATION = 5 * 24 * 60 * 60 * 1000;

  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  login(auth: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<ResponseCustom>(this.url + '/login', auth, {
      headers: headers,
    });
  }

  setUserSession(login: any): void {
    if (login.token) {
      this.authToken = login.token;
      this.setStorageItem(this.TOKEN_KEY, login.token);
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(login.utente));
      this.setSessionExpiry();
      this.isAuthenticated = true;
    } else {
      console.error('User token is undefined');
      this.isAuthenticated = false;
    }
  }

  private setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  private setSessionExpiry(): void {
    const expiryTime = new Date().getTime() + this.SESSION_DURATION;
    sessionStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
  }

  checkSessionExpiry(): void {
    const expiryTime = sessionStorage.getItem(this.SESSION_EXPIRY_KEY);
    if (expiryTime) {
      const currentTime = new Date().getTime();
      if (currentTime >= +expiryTime) {
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    this.checkSessionExpiry();
    this.authToken = this.getToken();
    return !!this.authToken;
  }

  getToken(): string | null {
    return (
      sessionStorage.getItem(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY)
    );
  }

  logout(): void {
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    sessionStorage.removeItem(this.SESSION_EXPIRY_KEY);
    this.clearSessionStorage();
    this.isAuthenticated = false;
    this.authToken = null;
    this.router.navigate(['/login']);
  }

  private clearSessionStorage(): void {
    sessionStorage.clear();
  }

  /* forgotInstructorPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiURLUsers}/forgot-password`, { email });
  } */

  /* resetUserPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiURLUsers}/reset-password/${token}`, { newPassword });
  } */

  /* requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiURLUsers}/forgot-password`, { email });
  } */

  // Verification methods
  /* verify(token: string): Observable<User> {
    return this.http.get<ResponseCustom>(`${this.apiURLUsers}/verify/${token}`);
  } */

  /* verifyHcaptcha(response: string): Observable<any> {
    const requestBody = { secret: this.secretKey, response };
    return this.http.post(`${this.apiURLUsers}/verify-hcaptcha`, requestBody);
  } */

  /* getSiteKey(): string {
    return this.siteKey;
  } */

  /* // Redirect URL methods
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  } */

  /* getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  } */
}
