import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  ConfirmationService,
  MegaMenuItem,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { MegaMenuModule } from 'primeng/megamenu';
import { Categoria } from '../../interfacce/categoria';
import { ResponseCustom } from '../../interfacce/response-custom';
import { CategoriaService } from '../../servizi/categoria.service';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { SpeedDialModule } from 'primeng/speeddial';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { UtenteService } from '../../servizi/utente.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { Utente } from '../../interfacce/utente';

import utenteNonLoggato from '../../dati/utente-non-loggato.json';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MegaMenuModule,
    ButtonModule,
    AvatarModule,
    MenubarModule,
    SpeedDialModule,
    TieredMenuModule,
    ConfirmDialogModule,
    BadgeModule,
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  items: MenuItem[] = [];
  elementiCarrello: MenuItem[] = [];
  accountItems: MenuItem[] = [];
  menuItems!: MenuItem[][];
  categorie: Categoria[] = [];
  isUtenteCollegato: boolean = false;
  utente!: Utente | null;
  letteraAccount!: any;
  isUtenteCaricato!: boolean;

  constructor(
    private categoriaService: CategoriaService,
    private utenteService: UtenteService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isUtenteCaricato = false;
    this.getAllCategorie();
    this.getUtente();
  }

  getAllCategorie() {
    this.categoriaService.getAll().subscribe({
      next: (res: ResponseCustom) => {
        this.categorie = res.data;
        this.getHeaderCategorie();
      },
      error: (err) => {
        this.getMessaggioErrore(err);
      },
    });
  }

  getUtente() {
    if (this.authService.isLoggedIn()) {
      this.authService.checkSessionExpiry();
      this.utente =
        JSON.parse(localStorage.getItem('utente')!) ||
        JSON.parse(sessionStorage.getItem('utente')!);
      this.accountItems = this.getAccountPulsanti();
      this.setIconaAccount();
      this.isUtenteCollegato = true;
      this.setElementiCarrello();
      this.isUtenteCaricato = true;
    } else {
      this.accountItems = utenteNonLoggato as MenuItem[];
      this.isUtenteCollegato = false;
      this.isUtenteCaricato = true;
    }
  }

  logout() {
this.isUtenteCaricato = false;
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler effettuare il logout?',
      header: 'Conferma logout',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.authService.logout();

          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: 'Logout effettuato',
            life: 3000,
          });

          this.isUtenteCollegato = false;
          this.accountItems = utenteNonLoggato as MenuItem[];
          this.isUtenteCaricato = true;
          this.router.navigateByUrl('/shop/prodotti');
      },
      reject: () => {
        this.isUtenteCaricato = true;
      }
    });
  }

  onActivate(event: any) {
    if (event && event.carrelloAggiornato) {
      event.carrelloAggiornato.subscribe(() => {
        this.getUtente();
      });
    } else if(event && event.caricaUtente) {
      event.caricaUtente.subscribe(() => {
        this.getUtente();
      });
    }
  }

  getHeaderCategorie() {
    return (this.items = [
      {
        label: 'Tutti i prodotti',
        routerLink: '/shop/prodotti/',
      },
      ...this.categorie.map((categoria) => ({
        label: categoria.nome,
        routerLink: '/shop/prodotti/categoria/' + categoria.nome + '/prodotti',
      })),
    ]);
  }

  checkStorage() {
    return (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    );
  }

  getAccountPulsanti() {
    return [
      {
        label: 'Il mio account',
        icon: 'pi pi-user',
        routerLink: '/shop/utente/account',
      },
      {
        label: 'I miei ordini',
        icon: 'pi pi-box',
        routerLink: '/shop/ordini',
      },
      {
        label: 'Esci',
        icon: 'pi pi-sign-out',
        styleClass: 'text-red-500',
        command: () => this.logout(),
      },
    ];
  }

  getMessaggioErrore(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: err.error.messaggio,
      life: 3000,
    });
  }

  setElementiCarrello() {
    var elementiCarrello = this.utente!.carrello.elementi;

    if (elementiCarrello.length > 0) {
      this.getElementiCarrello();
    } else {
      this.getCarrelloVuoto();
    }
  }

  getElementiCarrello() {
    return (this.elementiCarrello = [
      ...this.utente!.carrello.elementi.map((elemento: any) => ({
        label: `${elemento.quantita}x ${elemento.prodotto.nome}`,
        routerLink: '/shop/carrello',
      })),
      ...this.getElementiCarrelloGenerali(),
    ]);
  }

  getCarrelloVuoto() {
    return (this.elementiCarrello = [
      {
        label: 'Nessun articolo aggiunto al carrello',
        routerLink: '/shop/carrello',
        disabled: true,
      },
      ...this.getElementiCarrelloGenerali(),
    ]);
  }

  getElementiCarrelloGenerali() {
    return [
      {
        label: `Totale: € ${this.utente!.carrello.totale.toFixed(2)}`,
        style: { 'font-weight': '600' },
        routerLink: '/shop/carrello',
      },
      {
        label: `Vai al carrello`,
        icon: 'pi pi-arrow-right',
        style: { color: 'blue' },
        routerLink: `/shop/carrello`,
      },
    ];
  }

  setIconaAccount() {
    this.letteraAccount =
      this.utente!.ragioneSociale != null
        ? Array.from(this.utente!.ragioneSociale)[0]
        : Array.from(this.utente!.nome)[0];
  }
}
