import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pagina-non-trovata',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './pagina-non-trovata.component.html',
  styleUrl: './pagina-non-trovata.component.css'
})
export class PaginaNonTrovataComponent {

}
