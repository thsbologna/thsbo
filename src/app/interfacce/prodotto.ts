import { Categoria } from "./categoria";

export interface Prodotto {
    codice: string;
    nome: string;
    descrizione: string;
    prezzo: number | null;
    stato: number | null;
    disponibilita: number | null;
    giorniConsegnaMin: number | null;
    giorniConsegnaMax: number | null;
    ultimaModifica: string;
    categoria: Categoria | null;
    immagine: any;
}
