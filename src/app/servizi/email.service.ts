import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MailAziendaLiberoProfessionista } from '../interfacce/mail-azienda-libero-professionista';
import { MailPrivato } from '../interfacce/mail-privato';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends BaseService {
  url: string = this.baseUrl + '/mail';

  constructor(private http: HttpClient) {
    super();
  }

  inviaEmailAziendaLiberoProfessionista(email: MailAziendaLiberoProfessionista): Observable<any> {
    return this.http.post(this.url + '/azienda-libero-professionista/invia', email)
  }

  inviaEmailPrivato(email: MailPrivato): Observable<any> {
    return this.http.post(this.url + '/privato/invia', email)
  }
}
