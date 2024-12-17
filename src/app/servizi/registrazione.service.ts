import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root',
})
export class RegistrazioneService extends BaseService {
  url = this.baseUrl + '/utenti';

  constructor(private http: HttpClient) {
    super();
  }

  aggiungiUtentePrivato(request: any) {
    return this.http.post<ResponseCustom>(
      this.url + '/utente/privato/nuovo',
      request,
    );
  }
  aggiungiUtenteAziendaLiberoProfessionista(request: any) {
    return this.http.post<ResponseCustom>(
      this.url + '/utente/azienda-libero-professionista/nuovo',
      request
    );
  }
}
