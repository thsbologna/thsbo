import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../servizi/login.service';
import { ResponseCustom } from '../../interfacce/response-custom';
import { filter } from 'rxjs';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  rememberMe: boolean = false;
  errore: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: Router
  ) {}

  ngOnInit() {
    if (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    ) {
      this.route.navigateByUrl('/shop/prodotti');
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.errore = '';

    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res: ResponseCustom) => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('utente');
          sessionStorage.removeItem('utente');

          if (this.rememberMe) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('utente', res.data.id);
          } else {
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('utente', res.data.id);
          }

          this.rememberMe
            ? localStorage.setItem('token', res.data.token)
            : sessionStorage.setItem('token', res.data.token);

          window.location.reload();
        },
        error: (err: any) => {
          this.errore = 'Email o Password non validi, riprovare';
        },
      });
    }
  }

  cambiaStatoRicordami() {
    this.rememberMe = !this.rememberMe;
  }
}
