import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root'
})
export class ProdottoService extends BaseService {
  url: string = this.baseUrl + '/prodotti'

  constructor(private http: HttpClient) {
    super();
  }

  getAll() {
    return this.http.get<ResponseCustom>(this.url + '/attivi');
  }

  getByCategoria(nome: string) {
    return this.http.get<ResponseCustom>(this.url + '/categoria/' + nome + '/attivi');
  }

  getByCodice(codice: string) {
    return this.http.get<ResponseCustom>(this.url + '/prodotto/' + codice);
  }
}
