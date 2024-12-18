import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ResponseCustom } from '../../interfacce/response-custom';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Output() caricaUtente = new EventEmitter<any>();
  loginForm!: FormGroup;
  rememberMe: boolean = false;
  errore: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    if (this.authService.isLoggedIn()) {
      this.loading = false;
      this.route.navigateByUrl('/shop/prodotti');
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loading = false;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.loading = true;
    this.errore = '';

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: ResponseCustom) => {
          this.authService.setUserSession(res.data);

          if (!this.rememberMe) {
            localStorage.removeItem('token');
            localStorage.removeItem('utente');
          }

          this.loading = false;
          console.log(res.data);
          this.caricaUtente.emit();
          this.route.navigateByUrl('/shop/prodotti');
        },
        error: (err: any) => {
          this.loading = false;
          this.errore = 'Email o Password non validi, riprovare';
        },
      });
    }
  }

  cambiaStatoRicordami() {
    this.rememberMe = !this.rememberMe;
  }
}
