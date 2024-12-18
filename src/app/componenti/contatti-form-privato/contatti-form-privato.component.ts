import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FormPrefissi } from '../../enum/form-prefissi';
import { FormProvince } from '../../enum/form-province';
import { FormTipoAttivita } from '../../enum/form-tipo-attivita';
import { EmailService } from '../../servizi/email.service';
import { MailPrivato } from '../../interfacce/mail-privato';

@Component({
  selector: 'app-contatti-form-privato',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ProgressSpinnerModule, ToastModule, ReactiveFormsModule, ButtonModule, TooltipModule, InputTextModule, InputNumberModule, DropdownModule, InputTextareaModule,],
  providers: [MessageService, ConfirmationService],
  templateUrl: './contatti-form-privato.component.html',
  styleUrl: './contatti-form-privato.component.css'
})
export class ContattiFormPrivatoComponent {
  form!: FormGroup;
  formValido!: boolean;
  formInviato: boolean = false;

  tipoAttivita: FormTipoAttivita[] = [];
  province: FormProvince[] = [];
  prefissi: any[] = [];
  email!: MailPrivato;

  // Regular expressions
  private readonly regexPatterns = {
    indirizzoEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    codiceFiscale: /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-EHLMPRST](?:[0-9LMNPQRSTUV]{2})(?:[A-Z]{1})(?:[0-9LMNPQRSTUV]{3})([A-Z]{1})$/,
    codiceFiscaleAzienda: /^[A-Z]{6}\d{2}\w{2}\d{3}[A-Z]$/,
    partitaIVA: /^[0-9]{11}$/,
    numeroTelefono: /^[0-9]{9,10}$/,
  };

  constructor(private formBuilder: FormBuilder, private emailService: EmailService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.caricaDropdowns();
    this.creaForm();
  }

  private caricaDropdowns() {
    this.prefissi = Object.keys(FormPrefissi).map(key => ({
      key: key,
      value: FormPrefissi[key as keyof typeof FormPrefissi],
      label: `${key}  ${FormPrefissi[key as keyof typeof FormPrefissi]}`  // Concatenazione di key e value
    }));
    this.tipoAttivita = [...Object.values(FormTipoAttivita)];
    this.province = [...Object.values(FormProvince)];
  }

  taxCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const codiceFiscaleValido = this.regexPatterns.codiceFiscale.test(value);
      const codiceFiscaleAziendaValido = this.regexPatterns.codiceFiscaleAzienda.test(value);
      const partitaIVAValida = this.regexPatterns.partitaIVA.test(value);

      return (codiceFiscaleAziendaValido || codiceFiscaleValido || partitaIVAValida) ? null : { invalidTaxCode: true };
    };
  }

  private creaForm() {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(60)]],
      cognome: ['', [Validators.required, Validators.maxLength(60)]],
      codiceFiscale: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(16), this.taxCodeValidator()]],
      indirizzoEmail: ['', [Validators.required, Validators.email]],
      provincia: ['', Validators.required],
      prefisso: ['', Validators.required],
      numeroDiTelefono: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10), Validators.pattern(this.regexPatterns.numeroTelefono)]],
      messaggio: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10000)]],
    });
  }

  onSubmit() {
    this.formInviato = true;
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.email = this.form.value;
      this.email.prefisso = this.email.prefisso.valueOf();

      this.emailService.inviaEmailPrivato(this.email).subscribe({
        next: () => {
          this.formInviato = false;
          this.form.reset();
          this.messageService.add({ severity: 'success', summary: 'Inviata', detail: 'Mail inviata correttamente' });
        },
        error: (err: any) => {
          this.formInviato = false;
          this.messageService.add({ severity: 'error', summary: 'Errore', detail: "Errore durante l'invio della mail\n-" + err.error.messaggio });
        }
      });

      /* this.formInviato = false;
      this.confirmationService.confirm({
        accept: () => {
          this.form.reset();
        },
    }); */
    }
  }
}
