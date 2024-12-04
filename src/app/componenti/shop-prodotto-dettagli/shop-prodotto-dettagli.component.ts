import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Prodotto } from '../../interfacce/prodotto';
import { ResponseCustom } from '../../interfacce/response-custom';
import { BaseService } from '../../servizi/base.service';
import { ProdottoService } from '../../servizi/prodotto.service';

@Component({
  selector: 'app-shop-prodotto-dettagli',
  standalone: true,
  imports: [CommonModule,RouterModule, ButtonModule, CardModule, ConfirmDialogModule, TagModule, ProgressSpinnerModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-prodotto-dettagli.component.html',
  styleUrl: './shop-prodotto-dettagli.component.css'
})
export class ShopProdottoDettagliComponent {
  codice: string = '';
  prodotto!: Prodotto;
  baseUrl!: string;
  footer: string = 'Dettagli prodotto';

  constructor(
    private route: ActivatedRoute,  // Per ottenere il parametro 'nome' dalla rotta
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
this.baseUrl = this.baseService.baseUrl + '/immagini';

    this.route.params.subscribe(params => {
      this.codice = params['codice'];
      this.getAll(this.codice);
    });

    console.log(this.prodotto)
  }

  getAll(codice: string): void {
    this.prodottoService.getByCodice(codice).subscribe({
      next: (res: ResponseCustom) => {
        this.prodotto = {...res.data};
        console.log(res.data); // Imposta i prodotti nella variabile
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Errore', detail: err.error.message, life: 3000 });
      }
    });
  }

  faiInviareMail(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      accept: () => {
        this.router.navigateByUrl("/contatti")
      },
    });
  }
}
