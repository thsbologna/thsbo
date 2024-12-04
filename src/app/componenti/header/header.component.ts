import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {MenubarModule} from 'primeng/menubar'
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  pulsantiPagine!: MenuItem[];

  constructor(private router: Router){}

  ngOnInit(): void {
    this.pulsantiPagine = [
      { label: 'Home', icon: 'pi pi-home', command: () => this.navigate('/home') },
      {
        label: 'Azienda', icon: 'pi pi-building',
        command: () => this.navigate('/azienda'),
        items: [
          { label: 'Chi siamo', icon: 'pi pi-briefcase', command: () => this.navigate('/azienda', 'chi-siamo') },
          { label: 'Servizi', icon: 'pi pi-headphones', command: () => this.navigate('/azienda', 'servizi') },
          { label: 'Hardware', icon: 'pi pi-desktop', command: () => this.navigate('/azienda', 'hardware') },
          { label: 'Software', icon: 'pi pi-code', command: () => this.navigate('/azienda', 'software') },
          { label: 'Prodotti', icon: 'pi pi-server', command: () => this.navigate('/azienda', 'prodotti') },
          { label: 'Referenze', icon: 'pi pi-users', command: () => this.navigate('/azienda', 'referenze') },
          { label: 'Partners', icon: 'pi pi-user-plus', command: () => this.navigate('/azienda', 'partners') },
        ]
      },
      { label: 'Shop', icon: 'pi pi-shop', command: () => this.navigate('/shop/prodotti')},
      { label: 'Contatti', icon: 'pi pi-phone', command: () => this.navigate('/contatti')  }
    ]
  }

  /**
   * Naviga ad una rotta specifica e, se presente ad uno specifico frammento.
   *
   * @param {string} route - La rotta di navigazione
   * @param {string} [fragment] - Identificatore del frammento
   *
   * @returns {Promise<void>}
   */
  navigate(route: string, fragment?: string) {
    this.router.navigate([route], { fragment }).then(() => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
