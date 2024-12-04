import { FormProvince } from "../enum/form-province";

export interface MailPrivato {
  nome: string;
    codiceFiscale: string;
    indirizzoEmail: string;
    cognome: string;
    provincia: FormProvince;
    prefisso: string;
    numeroTelefono: string;
    messaggio: string;
}
