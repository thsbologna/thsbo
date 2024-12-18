import { Prodotto } from "./prodotto";

export interface ElementoCarrello {
  id: number;
  quantita: number;
  prezzoUnita: number;
  prodotto: Prodotto;
}
