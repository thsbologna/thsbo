import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormTipoAttivita } from '../../enum/form-tipo-attivita';
import { FormProvince } from '../../enum/form-province';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormPrefissi } from '../../enum/form-prefissi';
import { RegistrazioneService } from '../../servizi/registrazione.service';
import { ResponseCustom } from '../../interfacce/response-custom';
import { VerificaEmailService } from '../../servizi/verifica-email.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-registrati-form-privato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule,
    PasswordModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './registrati-form-privato.component.html',
  styleUrl: './registrati-form-privato.component.css',
})
export class RegistratiFormPrivatoComponent {
  @Input() nextCallback!: any;
  @Output() saveForm = new EventEmitter<FormGroup>();
  caricamento: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private registrazioneService: RegistrazioneService,
    private verificaEmailService: VerificaEmailService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
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
        comune: ['', Validators.required],
        via: ['', Validators.required],
        civico: ['', Validators.required],
        cap: ['', Validators.required],
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

  onSubmit() {
    if (this.form.valid) {
      this.caricamento = true;
      const email = this.form.get('indirizzoEmail')!.value;

      this.verificaEmailService.verificaIndirizzoEmail(email).subscribe({
        next: (res: ResponseCustom) => {
          this.caricamento = false;
          this.nextCallback.emit();
          this.saveForm.emit(this.form);
        },
        error: (err) => {
          this.caricamento = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: err.error.message,
            life: 3000,
          });
        },
      });
    }
  }
}
