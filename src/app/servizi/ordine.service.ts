import { HttpClient } from '@angular/common/http';
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

  creaOrdine(idUtente: any) {
    return this.http.post<ResponseCustom>(
      `${this.url}/ordine?utenteId=${idUtente}`,
      {headers: this.headers}
    );
  }

  getByUtente(idUtente: any) {
    return this.http.get<ResponseCustom>(this.url + '/utente/' + idUtente + "/ordini", {headers: this.headers});
  }

  getById(id: any) {
    return this.http.get<ResponseCustom>(this.url + "/ordine/" + id, {headers: this.headers});
  }
}
