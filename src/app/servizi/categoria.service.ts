import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService {

  url: string = this.baseUrl + '/categorie';

  constructor(private http: HttpClient) {
    super();
  }

  getAll() {
    return this.http.get<ResponseCustom>(this.url + '/attive')
  }
}
