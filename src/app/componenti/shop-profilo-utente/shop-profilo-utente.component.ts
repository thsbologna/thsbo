import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ResponseCustom } from '../../interfacce/response-custom';
import { UtenteService } from '../../servizi/utente.service';
import { CommonModule } from '@angular/common';
import { Utente } from '../../interfacce/utente';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-shop-profilo-utente',
  standalone: true,
  imports: [
    ButtonModule,
    AvatarModule,
    ConfirmDialogModule,
    CommonModule,
    RouterModule,
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './shop-profilo-utente.component.html',
  styleUrl: './shop-profilo-utente.component.css',
})
export class ShopProfiloUtenteComponent implements OnInit {
  utente!: Utente;
  isUtenteCollegato: boolean = false;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUtente();

  }

  getUtente() {
    this.isUtenteCollegato = false;
    if (this.authService.isLoggedIn()) {
      this.authService.checkSessionExpiry();
      this.utente =
        JSON.parse(localStorage.getItem('utente')!) ||
        JSON.parse(sessionStorage.getItem('utente')!);
    }
    this.isUtenteCollegato = true;
  }

  logout() {
    this.isUtenteCollegato = false;
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler effettuare il logout?',
      header: 'Conferma logout',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
        this.router.navigateByUrl('/shop/prodotti');
      },
      reject: () => {
        this.isUtenteCollegato = true;
      },
    });
  }
}
