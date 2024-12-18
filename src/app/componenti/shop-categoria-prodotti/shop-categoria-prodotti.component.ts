import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { UtenteService } from '../../servizi/utente.service';
import { Utente } from '../../interfacce/utente';
import { ElementiCarrelloService } from '../../servizi/elementi-carrello.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-shop-categoria-prodotti',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-categoria-prodotti.component.html',
  styleUrl: './shop-categoria-prodotti.component.css',
})
export class ShopCategoriaProdottiComponent {
  @Input() isUtenteCollegato!: boolean;
  @Output() carrelloAggiornato = new EventEmitter<any>();
  layout: 'list' | 'grid' = 'list';
  categoriaNome: string = '';
  prodotti!: Prodotto[];
  baseUrl!: string;
  caricamento: boolean = false;

  constructor(
    private route: ActivatedRoute, // Per ottenere il parametro 'nome' dalla rotta
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private elementiCarrelloService: ElementiCarrelloService
  ) {}

  ngOnInit() {
    this.caricamento = true;
    this.baseUrl = this.baseService.baseUrl + '/immagini';

    this.route.params.subscribe((params) => {
      this.categoriaNome = params['nome'];
      this.getAll(this.categoriaNome);
    });
    this.caricamento = false;
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

  checkStorage() {
    return (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    );
  }

  aggiungiAlCarrello(event: Event, prodotto: Prodotto) {
    event.stopImmediatePropagation();
    this.caricamento = true;

    if (this.checkStorage()) {
      this.elementiCarrelloService
        .aggiungiElementoAlCarrello(sessionStorage.getItem('carrello'), prodotto.codice, 1)
        .subscribe({
          next: (res: ResponseCustom) => {
            this.caricamento = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successo',
              detail: res.messaggio,
              life: 2000,
            });

            this.carrelloAggiornato.emit();
          },
        });
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
