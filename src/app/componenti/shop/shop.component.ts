import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { MegaMenuModule } from 'primeng/megamenu';
import { Categoria } from '../../interfacce/categoria';
import { ResponseCustom } from '../../interfacce/response-custom';
import { CategoriaService } from '../../servizi/categoria.service';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterModule, MegaMenuModule, ButtonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  items: MegaMenuItem[] = [];
  menuItems!: MenuItem[][];
  categorie: Categoria[] = [];
  isUtenteCollegato: boolean = false;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getAllCategorie();
  }

  getAllCategorie() {
    this.categoriaService.getAll().subscribe({
      next: (res: ResponseCustom) => {

        this.categorie = res.data;

        this.items = [
          /* {
            label: 'Account',
            icon: 'pi pi-user',
            items: [
              [
                {
                  label: 'Accedi',
                  visible: !this.isUtenteCollegato,
                  items: [
                    {
                      label: 'Login',
                      icon: 'pi pi-sign-in',
                      routerLink: '/shop/accedi',
                    },
                    {
                      label: 'Registrati',
                      icon: 'pi pi-user-plus',
                      routerLink: '/shop/registrazione',
                    }
                  ]
                },
                {
                  label: 'Il mio account',
                  visible: this.isUtenteCollegato,
                  items: [
                    {
                      label: 'Impostazioni',
                      icon: 'pi pi-cog'
                    },
                    {
                      label: 'Esci',
                      icon: 'pi pi-sign-out'
                    }
                  ]
                }
              ],
            ]
          }, */
          {
            label: 'Prodotti',
            icon: 'pi pi-box',
            routerLink: '/shop/prodotti',
            items: [
              [
                {
                  label: 'Categorie',
                  items: [...this.categorie.map((categoria) => ({
                    label: categoria.nome,
                    routerLink: '/shop/prodotti/categoria/' + categoria.nome + '/prodotti',
                  }))]
                }
              ],
            ]
          },
        ]
      },
      error: (err) => {
        console.error('Errore nel recuperare le categorie:', err);
      }
    });
  }

  onUtenteRegistrato() {
    this.isUtenteCollegato = true;
  }
}
