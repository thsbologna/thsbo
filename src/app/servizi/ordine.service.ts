import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root',
})
export class OrdineService extends BaseService {
  url = this.baseUrl + '/ordini';

  constructor(private http: HttpClient) {
    super();
  }

  override headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  creaOrdine(idUtente: any) {
    console.log(this.token);
    return this.http.post<ResponseCustom>(
      `${this.url}/ordine?utenteId=${idUtente}`,
      {},
      { headers: this.headers }
    );
  }

  getByUtente(idUtente: any) {
    return this.http.get<ResponseCustom>(
      this.url + '/utente/' + idUtente + '/ordini',
      { headers: this.headers }
    );
  }

  getById(id: any) {
    return this.http.get<ResponseCustom>(this.url + '/ordine/' + id, {
      headers: this.headers,
    });
  }
}
