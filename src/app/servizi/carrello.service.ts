import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService extends BaseService {

  url = this.baseUrl + "/carrelli";

  constructor(private http:HttpClient) {
    super();
  }

  getById(id: any) {
    return this.http.get<ResponseCustom>(this.url + "/carrello/" + id, {headers: this.headers});
  }
}
