import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormTipoAttivita } from '../../enum/form-tipo-attivita';
import { FormsModule } from '@angular/forms';
import { AccountTipoAttivita } from '../../enum/account-tipo-attivita';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistratiFormPrivatoComponent } from "../registrati-form-privato/registrati-form-privato.component";
import { RegistratiFormAziendaLiberoProfessionistaComponent } from "../registrati-form-azienda-libero-professionista/registrati-form-azienda-libero-professionista.component";

@Component({
  selector: 'app-registrati',
  standalone: true,
  imports: [CommonModule, StepperModule, ButtonModule, SelectButtonModule, FormsModule, RouterModule, RegistratiFormPrivatoComponent, RegistratiFormAziendaLiberoProfessionistaComponent],
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.css'
})
export class RegistratiComponent implements OnInit {
  @Input() isUtenteCollegato!: boolean;

  tipoAccount!: AccountTipoAttivita | null;
  tipiAttivita: any;
  isPrivato!: boolean;

  ngOnInit() {
    this.tipiAttivita = [...Object.keys(AccountTipoAttivita).map(attivita => ({
      key: attivita,
      value: AccountTipoAttivita[attivita as keyof typeof AccountTipoAttivita],
      label: `${attivita}`  // Concatenazione di key e value
    }))];

    this.tipoAccount = null;
  }

  vaiAlForm(nextCallback: { emit: () => void; }) {
    this.isPrivato = this.tipoAccount === AccountTipoAttivita.PRIVATO
    nextCallback.emit();
  }
}
