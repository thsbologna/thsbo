import { Component, Input } from '@angular/core';
import { AziendaProdotto } from '../../interfacce/azienda-prodotto';

@Component({
  selector: 'app-azienda-prodotti-card',
  standalone: true,
  imports: [],
  templateUrl: './azienda-prodotti-card.component.html',
  styleUrl: './azienda-prodotti-card.component.css',
})
export class AziendaProdottiCardComponent {
  @Input() prodotto!: AziendaProdotto;
}
