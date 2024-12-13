import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseCustom } from '../interfacce/response-custom';
import { Utente } from '../utente';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtenteService extends BaseService {
  url = this.baseUrl + '/utenti';
  private utente = new BehaviorSubject<any>(null);
  data$ = this.utente.asObservable();

  constructor(private http: HttpClient) {
    super();
  }

  getUtenteById(id: any) {
    return this.http.get<ResponseCustom>(this.url + '/utente/' + id);
  }

  setUtente(data: any) {
    this.utente.next(data);
  }

  getUtente() {
    return this.utente.value;
  }
}
