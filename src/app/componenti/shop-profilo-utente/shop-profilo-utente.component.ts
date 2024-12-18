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

@Component({
  selector: 'app-shop-profilo-utente',
  standalone: true,
  imports: [ButtonModule, AvatarModule, ConfirmDialogModule, CommonModule, RouterModule, ProgressSpinnerModule],
  providers: [ConfirmationService],
  templateUrl: './shop-profilo-utente.component.html',
  styleUrl: './shop-profilo-utente.component.css',
})
export class ShopProfiloUtenteComponent implements OnInit {

  utente!: Utente;

  constructor(private router: Router, private confirmationService: ConfirmationService, private utenteService: UtenteService) {
  }

  ngOnInit(): void {
    this.getUtente();
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler effettuare il logout?',
      header: 'Conferma logout',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (
          sessionStorage.getItem('token') != null ||
          sessionStorage.getItem('utente') != null
        ) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('utente');
          console.log(sessionStorage.getItem('utente'));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('utente');
        }
        window.location.reload();
      },
    });
  }

  getUtente() {
    var id;

    if(sessionStorage.getItem('utente') !== null) {
      id = sessionStorage.getItem('utente');
    } else {
      id = localStorage.getItem('utente');
    }

    this.utenteService.getUtenteById(id).subscribe({
      next: (res: ResponseCustom) => {
        this.utente = res.data;
      },
      error: (err: any) => {
        console.error(err.error.messaggio);
      },
    });
  }
}
