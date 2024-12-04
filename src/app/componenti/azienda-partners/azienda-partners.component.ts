import { Component } from '@angular/core';
import { AziendaCollaboratoreComponent } from "../azienda-collaboratore/azienda-collaboratore.component";

import partners from '../../dati/azienda-partners.json';
import { Collaboratore } from '../../interfacce/collaboratore';

@Component({
  selector: 'app-azienda-partners',
  standalone: true,
  imports: [AziendaCollaboratoreComponent],
  templateUrl: './azienda-partners.component.html',
  styleUrl: './azienda-partners.component.css'
})
export class AziendaPartnersComponent {
  partners!: Collaboratore[];

  ngOnInit() {
    this.partners = partners as Collaboratore[];
  }
}
