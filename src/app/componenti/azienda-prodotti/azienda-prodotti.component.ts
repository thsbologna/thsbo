import { Component, OnInit } from '@angular/core';

import prodotti from '../../dati/azienda-prodotti.json';
import { AziendaProdottiCardComponent } from '../azienda-prodotti-card/azienda-prodotti-card.component';
import { AziendaProdotto } from '../../interfacce/azienda-prodotto';

@Component({
  selector: 'app-azienda-prodotti',
  standalone: true,
  imports: [AziendaProdottiCardComponent],
  templateUrl: './azienda-prodotti.component.html',
  styleUrl: './azienda-prodotti.component.css'
})
export class AziendaProdottiComponent implements OnInit {

  prodotti: AziendaProdotto[] = [];
  iconClassList = 'text-4xl';

  /**
   * Inizializza l'array di prodotti con i dati forniti e imposta i colori delle icone
   * per ciascun prodotto chiamando il metodo `setIconColor`.
   */
  ngOnInit() {
    this.prodotti = prodotti as AziendaProdotto[];
    this.setIconColor(this.prodotti);
  }

  /**
   * Itera attraverso l'array di prodotti e assegna un colore alle icone in base al colore precedente.
   * I colori sono applicati in sequenza ciclica come segue:
   * - Da "text-blue-500" a "text-yellow-500"
   * - Da "text-yellow-500" a "text-green-600"
   * - Da "text-green-600" a "text-red-700"
   * - Da "text-red-700" si torna a "text-blue-500"
   *
   * Il colore iniziale è "text-blue-500". Ogni volta che viene applicato un nuovo colore,
   * il colore precedente viene aggiornato per garantire una sequenza continua.
   */
  setIconColor(products: AziendaProdotto[]) {
    var colorePrecedente: string = '';

    for (let i of products) {
      switch (colorePrecedente) {
        case 'text-blue-500':
          i.icona += ' text-yellow-500';
          colorePrecedente = "text-yellow-500";
          break;
        case 'text-yellow-500':
          i.icona += ' text-green-600';
          colorePrecedente = "text-green-600";
          break;
        case 'text-green-600':
          i.icona += ' text-red-700';
          colorePrecedente = "text-red-700";
          break;
        default:
          i.icona += ' text-blue-500';
          colorePrecedente = "text-blue-500";
          break;
      }
    }
  }
}
