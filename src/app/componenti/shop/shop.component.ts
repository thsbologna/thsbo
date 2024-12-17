import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
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
import { Utente } from '../../utente';

import utenteNonLoggato from '../../dati/utente-non-loggato.json';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    ProgressSpinnerModule
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
  utenteCaricato: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private utenteService: UtenteService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.utenteCaricato = false
    this.getAllCategorie();

      let id = sessionStorage!.getItem('utente') || localStorage.getItem('utente');
      this.getUtente(id);
  }

  getAllCategorie() {
    this.categoriaService.getAll().subscribe({
      next: (res: ResponseCustom) => {
        this.categorie = res.data;
        this.headerCategorie();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: err.error.messaggio,
          life: 3000,
        });
      },
    });
  }

  getUtente(id: any) {

    if (id == null || id == undefined ){
      this.accountItems = utenteNonLoggato as MenuItem[];
      this.utenteCaricato = true;
      return;
    }

    this.utenteService.getUtenteById(id).subscribe({
      next: (res: ResponseCustom) => {
        this.utenteCaricato = true;
        this.utenteService.setUtente(res.data);
        this.utente = this.utenteService.getUtente();
        this.isUtenteCollegato = true;
        this.accountItems = this.getAccountPulsanti();

        sessionStorage.setItem('carrello', res.data.carrello.id);
        const elementiCarrello = this.utente!.carrello.elementi;

        if (elementiCarrello.length > 0) {
          this.getElementiCarrello();
        } else {
          this.getCarrelloVuoto();
        }

        this.letteraAccount =
          this.utente!.ragioneSociale != null
            ? Array.from(this.utente!.ragioneSociale)[0]
            : Array.from(this.utente!.nome)[0];


      },
      error: (err: any) => {
        this.utenteCaricato = true;
        this.utente = null;
        this.accountItems = utenteNonLoggato as MenuItem[];
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: err.error.message,
          life: 3000,
        });
      },
    });


  }

  logout() {
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler effettuare il logout?',
      header: 'Conferma logout',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.checkStorage()) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('utente');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('utente');
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Successo',
          detail: "Logout effettuato",
          life: 3000,
        });

        this.isUtenteCollegato = false;
        this.accountItems = utenteNonLoggato as MenuItem[];
        this.router.navigateByUrl('/shop/prodotti');
      },
    });
  }

  onActivate(event: any) {

    if (event && event.carrelloAggiornato) {
      event.carrelloAggiornato.subscribe(() => {
        if (this.checkStorage()) {
          let id = sessionStorage!.getItem('utente') || localStorage.getItem('utente');
          this.getUtente(id);
        } else {
          this.accountItems = utenteNonLoggato as MenuItem[];
        }
      });
    }

  }

  headerCategorie() {

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
        routerLink: '/shop/ordini'
      },
      {
        label: 'Impostazioni',
        icon: 'pi pi-cog',
      },
      {
        label: 'Esci',
        icon: 'pi pi-sign-out',
        styleClass: 'text-red-500',
        command: () => this.logout(),
      },
    ];
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
}
