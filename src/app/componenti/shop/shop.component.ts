import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MegaMenuItem, MenuItem } from 'primeng/api';
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
  ],
  providers: [ConfirmationService],
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
  utente!: Utente;
  letteraAccount!: any;

  constructor(
    private categoriaService: CategoriaService,
    private utenteService: UtenteService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCategorie();

    if (this.checkStorage()) {
      let id =
        sessionStorage!.getItem('utente') !== null
          ? sessionStorage!.getItem('utente')
          : localStorage.getItem('utente');
      this.getUtente(id);
    } else {
      this.accountItems = utenteNonLoggato as MenuItem[];
    }
  }

  getAllCategorie() {
    this.categoriaService.getAll().subscribe({
      next: (res: ResponseCustom) => {
        this.categorie = res.data;
        this.headerCategorie();
      },
      error: (err) => {
        console.error('Errore nel recuperare le categorie:', err);
      },
    });
  }

  getUtente(id: any) {
    this.utenteService.getUtenteById(id).subscribe({
      next: (res: ResponseCustom) => {
        this.utenteService.setUtente(res.data);
        this.utente = this.utenteService.getUtente();
        this.isUtenteCollegato = true;
        this.accountItems = this.getAccountPulsanti();

        sessionStorage.setItem('carrello', res.data.carrello.id);
        const elementiCarrello = this.utente.carrello.elementi;

        if (elementiCarrello.length > 0) {
          this.getElementiCarrello();
        } else {
          this.getCarrelloVuoto();
        }

        this.letteraAccount =
          this.utente.ragioneSociale != null
            ? Array.from(this.utente.ragioneSociale)[0]
            : Array.from(this.utente.nome)[0];
      },
      error: (err: any) => {
        console.error(err.error.messaggio);
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
        this.isUtenteCollegato = false;
        this.accountItems = utenteNonLoggato as MenuItem[];
        this.router.navigateByUrl('/shop/prodotti');
      },
    });
  }

  onActivate(event: any) {
    // Se il componente attivato è un componente figlio, aggiorna i dati del carrello
    if (event && event.carrelloAggiornato) {
      event.carrelloAggiornato.subscribe(() => {
        if (this.checkStorage()) {
          let id =
            sessionStorage!.getItem('utente') !== null
              ? sessionStorage!.getItem('utente')
              : localStorage.getItem('utente');
          this.getUtente(id);
        } else {
          this.accountItems = utenteNonLoggato as MenuItem[];
        } // Ricarica i dati del carrello
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
      ...this.utente.carrello.elementi.map((elemento: any) => ({
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
        label: `Totale: € ${this.utente.carrello.totale.toFixed(2)}`,
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
