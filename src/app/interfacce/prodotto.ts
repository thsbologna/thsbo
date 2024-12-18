import { Categoria } from "./categoria";

export interface Prodotto {
  codice: string;
  codiceProduttore: string;
  nome: string;
  descrizione: string;
  consumabili: string;
  prezzo: number | null;
  stato: number | null;
  disponibilita: number | null;
  giorniConsegnaMin: number | null;
  giorniConsegnaMax: number | null;
  ultimaModifica: string;
  categoria: Categoria | null;
  immagine: any;
}
