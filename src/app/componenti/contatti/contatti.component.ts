import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview'
import { ContattiFormAziendaLiberoProfessionistaComponent } from "../contatti-form-azienda-libero-professionista/contatti-form-azienda-libero-professionista.component";
import { ContattiFormPrivatoComponent } from '../contatti-form-privato/contatti-form-privato.component';

@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [TabViewModule, ContattiFormAziendaLiberoProfessionistaComponent, ContattiFormPrivatoComponent],
  templateUrl: './contatti.component.html',
  styleUrl: './contatti.component.css'
})
export class ContattiComponent {

}
