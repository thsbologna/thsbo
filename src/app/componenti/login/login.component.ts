import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox'
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../servizi/login.service';
import { ResponseCustom } from '../../interfacce/response-custom';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CheckboxModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  rememberMe: boolean = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private route: Router) {}

  ngOnInit() {
      this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]]
      });
  }

  get email() {
      return this.loginForm.get('email');
  }

  get password() {
      return this.loginForm.get('password');
  }

  onSubmit() {
      if (this.loginForm.valid) {
         this.loginService.login(this.loginForm.value).subscribe({
          next: (res: ResponseCustom) => {
            this.route.navigateByUrl("/shop/prodotti")

          },
          error: (err: any) => {
            console.error(err.error.messaggio);
          }
         })
      }
  }
}
