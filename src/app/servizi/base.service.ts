import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  baseUrl: string = 'http://192.168.1.177:8585/api';

  token = localStorage.getItem('token') || sessionStorage.getItem('token');

  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  constructor() {}
}
