import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Method to store JWT token in local storage
  storeToken(token: string): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      const localStorage = this.document.defaultView?.localStorage;
      if (localStorage) {
        localStorage.setItem(this.tokenKey, token);
        return of(); // Return an observable of void
      }
    }
    console.error('localStorage is not available in the current environment');
    return of(); // Return an observable of void
  }

  // Method to retrieve JWT token from local storage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const localStorage = this.document.defaultView?.localStorage;
      if (localStorage) {
        return localStorage.getItem(this.tokenKey);
      }
    }
    console.error('localStorage is not available in the current environment');
    return null;
  }

  // Method to remove JWT token from local storage
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const localStorage = this.document.defaultView?.localStorage;
      if (localStorage) {
        localStorage.removeItem(this.tokenKey);
        return;
      }
    }
    console.error('localStorage is not available in the current environment');
  }
}
