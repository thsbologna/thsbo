import { Injectable, Injector } from '@angular/core';
import { ProdottoService } from './prodotto.service';
import { ResponseCustom } from '../interfacce/response-custom';
import { Prodotto } from '../interfacce/prodotto';

@Injectable({
  providedIn: 'root',
})
export class PrerenderService {
  constructor(private injector: Injector) {}

  async getPrerenderParams(): Promise<Record<string, string>[]> {
    const prodottoService = this.injector.get(ProdottoService);

    try {
      // Recupera tutti i prodotti
    let prodotti: Prodotto[] = [];

      prodottoService.getAll().subscribe({
        next: (res: ResponseCustom) => {
          prodotti = res.data;
        }
      });

      // Mappa i prodotti all'oggetto necessario per il prerendering (ogni prodotto avrà una chiave "id" con il suo valore)
      return prodotti.map((product: Prodotto) => ({ id: product.codice.toString() }));
    } catch (error) {
      console.error('Errore durante la chiamata API per i prodotti', error);
      return []; // In caso di errore, restituisci un array vuoto
    }
  }
}
