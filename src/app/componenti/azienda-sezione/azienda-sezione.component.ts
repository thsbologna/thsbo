import { Component, Input } from '@angular/core';
import { AziendaSezione } from '../../interfacce/azienda-sezione';

@Component({
  selector: 'app-azienda-sezione',
  standalone: true,
  imports: [],
  templateUrl: './azienda-sezione.component.html',
  styleUrl: './azienda-sezione.component.css',
})
export class AziendaSezioneComponent {
  @Input() sezione!: AziendaSezione;
}
