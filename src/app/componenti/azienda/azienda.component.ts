import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AziendaSezioneComponent } from '../azienda-sezione/azienda-sezione.component';
import sezioni from '../../dati/sezioni-azienda.json';
import { AziendaProdottiComponent } from '../azienda-prodotti/azienda-prodotti.component';
import { AziendaReferenzeComponent } from '../azienda-referenze/azienda-referenze.component';
import { AziendaPartnersComponent } from '../azienda-partners/azienda-partners.component';
import { AziendaSezione } from '../../interfacce/azienda-sezione';

@Component({
  selector: 'app-azienda',
  standalone: true,
  imports: [
    AziendaSezioneComponent,
    AziendaProdottiComponent,
    AziendaReferenzeComponent,
    AziendaPartnersComponent,
  ],
  templateUrl: './azienda.component.html',
  styleUrl: './azienda.component.css',
})
export class AziendaComponent implements OnInit, AfterViewInit {
  sezioni: AziendaSezione[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.sezioni = sezioni as AziendaSezione[];
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
