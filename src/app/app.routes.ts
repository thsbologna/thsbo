import { Routes } from '@angular/router';
import { AziendaComponent } from './componenti/azienda/azienda.component';
import { ContattiComponent } from './componenti/contatti/contatti.component';
import { HomeComponent } from './componenti/home/home.component';
import { PaginaNonTrovataComponent } from './componenti/pagina-non-trovata/pagina-non-trovata.component';
import { ShopCategoriaProdottiComponent } from './componenti/shop-categoria-prodotti/shop-categoria-prodotti.component';
import { ShopProdottiComponent } from './componenti/shop-prodotti/shop-prodotti.component';
import { ShopProdottoDettagliComponent } from './componenti/shop-prodotto-dettagli/shop-prodotto-dettagli.component';
import { ShopComponent } from './componenti/shop/shop.component';
import { LoginComponent } from './componenti/login/login.component';
import { RegistratiComponent } from './componenti/registrati/registrati.component';
import { ShopProfiloUtenteComponent } from './componenti/shop-profilo-utente/shop-profilo-utente.component';
import { authGuard } from './servizi/auth.guard';
import { CarrelloComponent } from './componenti/carrello/carrello.component';
import { AggiornaPasswordComponent } from './componenti/aggiorna-password/aggiorna-password.component';

export const routes: Routes = [
  {
    path: 'home',
    title:
      'Soluzioni Informatiche a Bologna | TH&S Bologna - Hardware, Software e Assistenza',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'azienda',
    component: AziendaComponent,
    title: 'TH&S Bologna SRL - Azienda',
  },
  {
    path: 'shop',
    component: ShopComponent,
    title: 'TH&S Bologna SRL - Shop',
    children: [
      {
        path: 'prodotti',
        component: ShopProdottiComponent,
        title: 'TH&S Bologna SRL - Prodotti',
      },
      {
        path: 'prodotti/prodotto/:codice/prodotto',
        component: ShopProdottoDettagliComponent,
      },
      {
        path: 'prodotti/categoria/:nome/prodotti',
        component: ShopCategoriaProdottiComponent,
      },
      {
        path: 'accedi',
        component: LoginComponent,
        title: 'TH&S Bologna SRL - Accedi',
      },
      {
        path: 'registrazione',
        component: RegistratiComponent,
        title: 'TH&S Bologna SRL - Registrati',
      },
      {
        path: 'utente/account',
        component: ShopProfiloUtenteComponent,
        title: 'TH&S Bologna SRL - Il tuo profilo',
        canActivate: [authGuard],
      },
      {
        path: 'carrello',
        component: CarrelloComponent,
        title: 'TH&S Bologna SRL - Il tuo carrello',
        canActivate: [authGuard],
      },
      {
        path: 'cambia-password',
        component: AggiornaPasswordComponent,
        title: 'TH&S Bologna SRL - Cambia password Account',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'contatti',
    component: ContattiComponent,
    title: 'TH&S Bologna SRL - Contatti',
  },
  {
    path: '**',
    component: PaginaNonTrovataComponent,
    title: 'TH&S Bologna SRL - Pagina Non Trovata',
  },
];
