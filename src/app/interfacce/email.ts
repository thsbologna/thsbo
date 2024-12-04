import { FormProvince } from "../enum/form-province";

export interface Email {
    ragioneSociale: string;
    CodiceFiscale: string;
    indirizzoEmail: string;
    partitaIVA: string;
    tipoAttivita: string;
    provincia: FormProvince;
    prefisso: string;
    numeroTelefono: string;
    messaggio: string;
}
