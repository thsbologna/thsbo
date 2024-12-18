import { ElementoOrdine } from "./elemento-ordine";

export interface Ordine {
  id: number;
  utenteId: number;
  data: Date;
  totale: number;
  elementi: ElementoOrdine[];
}
