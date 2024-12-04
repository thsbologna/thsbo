import { Component } from '@angular/core';

import referenze from '../../dati/referenze-azienda.json';
import { AziendaCollaboratoreComponent } from "../azienda-collaboratore/azienda-collaboratore.component";
import { Collaboratore } from '../../interfacce/collaboratore';

@Component({
  selector: 'app-azienda-referenze',
  standalone: true,
  imports: [AziendaCollaboratoreComponent],
  templateUrl: './azienda-referenze.component.html',
  styleUrl: './azienda-referenze.component.css'
})
export class AziendaReferenzeComponent {
  referenze!: Collaboratore[];

  ngOnInit() {
    this.referenze = referenze as Collaboratore[];
  }
}
