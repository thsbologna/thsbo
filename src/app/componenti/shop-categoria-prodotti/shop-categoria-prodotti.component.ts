import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Prodotto } from '../../interfacce/prodotto';
import { ResponseCustom } from '../../interfacce/response-custom';
import { BaseService } from '../../servizi/base.service';
import { ProdottoService } from '../../servizi/prodotto.service';

@Component({
  selector: 'app-shop-categoria-prodotti',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, RouterModule, ConfirmDialogModule, ProgressSpinnerModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-categoria-prodotti.component.html',
  styleUrl: './shop-categoria-prodotti.component.css',
})
export class ShopCategoriaProdottiComponent {
  @Input() isUtenteCollegato!: boolean;
  layout: 'list' | 'grid' = 'list';
  categoriaNome: string = '';
  prodotti!: Prodotto[];
  baseUrl!: string;

  constructor(
    private route: ActivatedRoute, // Per ottenere il parametro 'nome' dalla rotta
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.baseUrl = this.baseService.baseUrl + '/immagini'

    this.route.params.subscribe((params) => {
      this.categoriaNome = params['nome'];
      this.getAll(this.categoriaNome);
    });
  }

  getAll(categoriaNome: string): void {
    this.prodottoService.getByCategoria(categoriaNome).subscribe({
      next: (res: ResponseCustom) => {
        this.prodotti = res.data;
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: err.error.message,
          life: 3000,
        });
      },
    });
  }

  aggiungiAlCarrello(event: Event) {
    event.stopPropagation();

    if (this.isUtenteCollegato) {
    } else {
      this.router.navigateByUrl('/shop/accedi');
    }
  }

  faiInviareMail(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      accept: () => {
        this.router.navigateByUrl('/contatti');
      },
    });
  }
}
