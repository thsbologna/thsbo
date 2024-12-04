import { Routes } from '@angular/router';
import { AziendaComponent } from './componenti/azienda/azienda.component';
import { ContattiComponent } from './componenti/contatti/contatti.component';
import { HomeComponent } from './componenti/home/home.component';
import { PaginaNonTrovataComponent } from './componenti/pagina-non-trovata/pagina-non-trovata.component';
import { ShopCategoriaProdottiComponent } from './componenti/shop-categoria-prodotti/shop-categoria-prodotti.component';
import { ShopProdottiComponent } from './componenti/shop-prodotti/shop-prodotti.component';
import { ShopProdottoDettagliComponent } from './componenti/shop-prodotto-dettagli/shop-prodotto-dettagli.component';
import { ShopComponent } from './componenti/shop/shop.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'TH&S Bologna SRL - Soluzioni Informatiche',
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
      /* {
                path: 'accedi',
                component: LoginComponent,
                title: 'TH&S Bologna SRL - Accedi',
            },
            {
                path: 'registrazione',
                component: RegistratiComponent,
                title: 'TH&S Bologna SRL - Registrati',
            } */
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
