import { Prodotto } from "./prodotto";

export interface ElementoOrdine {
  prodotto: Prodotto;
  quantita: number;
  prezzo: number;
}
