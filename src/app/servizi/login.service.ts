import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ResponseCustom } from '../interfacce/response-custom';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {
  url = this.baseUrl + "/auth"

  constructor(private http: HttpClient) {
    super();
  }

  login(auth: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<ResponseCustom>(this.url + "/login", auth, {headers});
  }
}
