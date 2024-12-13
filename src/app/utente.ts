export interface Utente {
  ragioneSociale: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  indirizzoEmail: string;
  partitaIVA: string;
  attivita: string;
  provincia: string;
  prefisso: string;
  numeroDiTelefono: string;
  password: string;
  ordini: any[];
  carrello: any;
}
