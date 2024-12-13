import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormTipoAttivita } from '../../enum/form-tipo-attivita';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AccountTipoAttivita } from '../../enum/account-tipo-attivita';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegistratiFormPrivatoComponent } from '../registrati-form-privato/registrati-form-privato.component';
import { RegistratiFormAziendaLiberoProfessionistaComponent } from '../registrati-form-azienda-libero-professionista/registrati-form-azienda-libero-professionista.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { UtenteService } from '../../servizi/utente.service';
import { RegistrazioneService } from '../../servizi/registrazione.service';
import { ResponseCustom } from '../../interfacce/response-custom';
import { VerificaEmailService } from '../../servizi/verifica-email.service';

@Component({
  selector: 'app-registrati',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    InputNumberModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
    RouterModule,
    RegistratiFormPrivatoComponent,
    RegistratiFormAziendaLiberoProfessionistaComponent,
  ],
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.css',
})
export class RegistratiComponent implements OnInit {
  @Input() isUtenteCollegato!: boolean;

  privatoForm!: FormGroup;
  aziendaLiberoProfessionistaForm!: FormGroup;
  tipoAccount!: AccountTipoAttivita | null;
  tipiAttivita: any;
  isPrivato!: boolean;
  codiceVerifica!: string;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private registrazioneService: RegistrazioneService,
    private verificaEmailService: VerificaEmailService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('utente') || localStorage.getItem('utente')) {
      this.route.navigateByUrl('/shop/prodotti');
    }

    this.tipiAttivita = [
      ...Object.keys(AccountTipoAttivita).map((attivita) => ({
        key: attivita,
        value:
          AccountTipoAttivita[attivita as keyof typeof AccountTipoAttivita],
        label: `${attivita}`, // Concatenazione di key e value
      })),
    ];

    this.tipoAccount = null;

    this.generaFormPrivato();
    this.generaFormAziendaLiberoProfessionista();
  }

  vaiAlForm(nextCallback: { emit: () => void }) {
    this.isPrivato = this.tipoAccount === AccountTipoAttivita.PRIVATO;
    nextCallback.emit();
  }

  setFormPrivato(form: FormGroup) {
    this.privatoForm.patchValue(form.value);
  }

  setFormAziendaLiberoProfessionista(form: FormGroup) {
    this.aziendaLiberoProfessionistaForm.patchValue(form.value)
  }

  registraUtente(nextCallback: any) {
    if (this.isPrivato) {
      this.registrazioneService
        .aggiungiUtentePrivato(this.privatoForm.value)
        .subscribe({
          next: (res: ResponseCustom) => {
            nextCallback.emit();
          },
          error: (err: ResponseCustom) => {},
        });
    } else {
      this.registrazioneService
        .aggiungiUtenteAziendaLiberoProfessionista(this.aziendaLiberoProfessionistaForm.value)
        .subscribe({
          next: (res: ResponseCustom) => {
            nextCallback.emit();
          },
          error: (err: ResponseCustom) => {},
        });
    }
  }

  checkCodice(nextCallback: any) {
      this.verificaEmailService
        .checkCodice(
          this.privatoForm!.get('indirizzoEmail')!.value,
          this.codiceVerifica
        )
        .subscribe({
          next: (res: ResponseCustom) => {
            this.registraUtente(nextCallback);
          },
          error: (err) => {
            console.error(err.error.messaggio);
          },
        });

  }

  generaFormPrivato() {
    this.privatoForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      codiceFiscale: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(16),
        ],
      ],
      indirizzoEmail: ['', [Validators.required, Validators.email]],
      prefisso: ['', Validators.required],
      numeroDiTelefono: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: ['', [Validators.required]],
      ripetiPassword: ['', [Validators.required]],
    });
  }

  generaFormAziendaLiberoProfessionista() {
    this.aziendaLiberoProfessionistaForm = this.fb.group(
      {
        ragioneSociale: ['', [Validators.required, Validators.maxLength(60)]],
        codiceFiscale: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(16),
          ],
        ],
        indirizzoEmail: ['', [Validators.required, Validators.email]],
        partitaIVA: [
          null,
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
          ],
        ],
        tipoAttivita: ['', Validators.required],
        provincia: ['', Validators.required],
        prefisso: ['', Validators.required],
        numeroDiTelefono: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),

          ],
        ],
        password: ['', [Validators.required]],
        ripetiPassword: ['', [Validators.required]],
      },
    );
  }
}
