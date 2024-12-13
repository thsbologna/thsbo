import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService extends BaseService {

  url = this.baseUrl + "/verifica";

  constructor(private http: HttpClient) {
    super();
  }

  verificaIndirizzoEmail(email: string) {
    return this.http.post<ResponseCustom>(this.url + "/genera-codice", email);
  }

  checkCodice(email: string, codice: string) {
    return this.http.post<ResponseCustom>(this.url + '/verifica-codice', {email, codice});
  }
}
