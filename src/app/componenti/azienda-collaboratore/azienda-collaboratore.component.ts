import { Component, Input } from '@angular/core';
import { Collaboratore } from '../../interfacce/collaboratore';

@Component({
  selector: 'app-azienda-collaboratore',
  standalone: true,
  imports: [],
  templateUrl: './azienda-collaboratore.component.html',
  styleUrl: './azienda-collaboratore.component.css'
})
export class AziendaCollaboratoreComponent {

  @Input() collaboratore!: Collaboratore;
}
