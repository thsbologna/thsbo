import { Component, Input } from '@angular/core';
import { FormPrefissi } from '../../enum/form-prefissi';
import { FormTipoAttivita } from '../../enum/form-tipo-attivita';
import { FormProvince } from '../../enum/form-province';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccountTipoAttivita } from '../../enum/account-tipo-attivita';
import { RegistrazioneService } from '../../servizi/registrazione.service';
import { ResponseCustom } from '../../interfacce/response-custom';

@Component({
  selector: 'app-registrati-form-azienda-libero-professionista',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PasswordModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: './registrati-form-azienda-libero-professionista.component.html',
  styleUrl: './registrati-form-azienda-libero-professionista.component.css',
})
export class RegistratiFormAziendaLiberoProfessionistaComponent {
  @Input() nextCallback!: any;
  @Input() attivita!: AccountTipoAttivita;

  form!: FormGroup;
  rememberMe: boolean = false;

  tipoAttivita: FormTipoAttivita[] = [];
  province: FormProvince[] = [];
  prefissi: any[] = [];

  // Regular expressions
  private readonly regexPatterns = {
    indirizzoEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    codiceFiscale:
      /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-EHLMPRST](?:[0-9LMNPQRSTUV]{2})(?:[A-Z]{1})(?:[0-9LMNPQRSTUV]{3})([A-Z]{1})$/,
    codiceFiscaleAzienda: /^[A-Z]{6}\d{2}\w{2}\d{3}[A-Z]$/,
    partitaIVA: /^[0-9]{11}$/,
    numeroTelefono: /^[0-9]{10}$/,
  };

  constructor(private fb: FormBuilder, private registrazioneService: RegistrazioneService) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        ragioneSociale: ['', [Validators.required, Validators.maxLength(60)]],
        codiceFiscale: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(16),
            this.taxCodeValidator(),
          ],
        ],
        indirizzoEmail: ['', [Validators.required, Validators.email]],
        partitaIVA: [
          null,
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(this.regexPatterns.partitaIVA),
          ],
        ],
        tipoAttivita: [this.attivita, Validators.required],
        provincia: ['', Validators.required],
        prefisso: ['', Validators.required],
        numeroDiTelefono: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(this.regexPatterns.numeroTelefono),
          ],
        ],
        password: ['', [Validators.required]],
        ripetiPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator }
    );

    this.caricaDropdowns();
  }

  taxCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const codiceFiscaleValido = this.regexPatterns.codiceFiscale.test(value);
      const codiceFiscaleAziendaValido =
        this.regexPatterns.codiceFiscaleAzienda.test(value);
      const partitaIVAValida = this.regexPatterns.partitaIVA.test(value);

      return codiceFiscaleAziendaValido ||
        codiceFiscaleValido ||
        partitaIVAValida
        ? null
        : { invalidTaxCode: true };
    };
  }

  passwordsMatchValidator(
    formGroup: FormGroup
  ): { [key: string]: boolean } | null {
    const password = formGroup.get('password');
    const ripetiPassword = formGroup.get('ripetiPassword');

    if (password && ripetiPassword && password.value !== ripetiPassword.value) {
      return { passwordsDoNotMatch: true };
    }

    return null; // No error if passwords match
  }

  private caricaDropdowns() {
    this.prefissi = Object.keys(FormPrefissi).map((key) => ({
      key: key,
      value: FormPrefissi[key as keyof typeof FormPrefissi],
      label: `${key}  ${FormPrefissi[key as keyof typeof FormPrefissi]}`, // Concatenazione di key e value
    }));
    this.tipoAttivita = [...Object.values(FormTipoAttivita)];
    this.province = [...Object.values(FormProvince)];
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.form.valid) {
      this.registrazioneService
        .aggiungiUtenteAziendaLiberoProfessionista(this.form.value)
        .subscribe({
          next: (res: ResponseCustom) => {
            this.nextCallback.emit();
          },
          error: (err: ResponseCustom) => {},
        });
    }
  }
}
