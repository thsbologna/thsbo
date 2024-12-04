import { FormProvince } from "../enum/form-province";

export interface MailAziendaLiberoProfessionista {
    ragioneSociale: string;
    codiceFiscale: string;
    indirizzoEmail: string;
    partitaIVA: string;
    tipoAttivita: string;
    provincia: FormProvince;
    prefisso: string;
    numeroTelefono: string;
    messaggio: string;
}
