import { ElementoCarrello } from "./elemento-carrello";

export interface Carrello {
  id: number;
  elementi: ElementoCarrello[];
  totale: number;
}
