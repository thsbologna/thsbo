import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseCustom } from '../interfacce/response-custom';

@Injectable({
  providedIn: 'root',
})
export class ElementiCarrelloService extends BaseService {
  url = this.baseUrl + '/elementi-carrello';

  constructor(private http: HttpClient) {
    super();
  }

  aggiungiElementoAlCarrello(idCarrello: any, idProdotto: any, quantita: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<ResponseCustom>(
      `${this.url}/elemento/aggiungi?carrelloId=${idCarrello}&codiceProdotto=${idProdotto}&quantita=${quantita}`,
      { headers }
    );
  }

  aggiornaQuantitaElemento(idCarrello: any, idProdotto: any, quantita: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put<ResponseCustom>(
      `${this.url}/${idCarrello}/prodotto/${idProdotto}/aggiorna?quantita=${quantita}`,
      { headers }
    );
  }

  rimuoviElemento(idCarrello: any, idProdotto: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.delete<ResponseCustom>(
      `${this.url}/${idCarrello}/prodotto/${idProdotto}/rimuovi`,
      { headers }
    );
  }
}
