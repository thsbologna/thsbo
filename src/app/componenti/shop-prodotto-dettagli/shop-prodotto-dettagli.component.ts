import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Prodotto } from '../../interfacce/prodotto';
import { ResponseCustom } from '../../interfacce/response-custom';
import { BaseService } from '../../servizi/base.service';
import { ProdottoService } from '../../servizi/prodotto.service';
import { Meta, Title } from '@angular/platform-browser';
import { UtenteService } from '../../servizi/utente.service';
import { Utente } from '../../utente';
import { ElementiCarrelloService } from '../../servizi/elementi-carrello.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-shop-prodotto-dettagli',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    TagModule,
    ProgressSpinnerModule,
    InputNumberModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-prodotto-dettagli.component.html',
  styleUrl: './shop-prodotto-dettagli.component.css',
})
export class ShopProdottoDettagliComponent {
  @Output() carrelloAggiornato = new EventEmitter<any>();
  codice: string = '';
  prodotto!: Prodotto;
  baseUrl!: string;
  footer: string = 'Dettagli prodotto';
  quantita: number = 1;

  constructor(
    private route: ActivatedRoute, // Per ottenere il parametro 'nome' dalla rotta
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private elementiCarrelloService: ElementiCarrelloService
  ) {}

  ngOnInit() {
    this.baseUrl = this.baseService.baseUrl + '/immagini';

    this.route.params.subscribe((params) => {
      this.codice = params['codice'];
      this.getProdotto(this.codice);
    });
  }

  getProdotto(codice: string): void {
    this.prodottoService.getByCodice(codice).subscribe({
      next: (res: ResponseCustom) => {
        this.prodotto = { ...res.data };

        this.titleService.setTitle(`${this.prodotto.nome} - TH&S Bologna`);
        this.metaService.updateTag({
          name: 'description',
          content: this.prodotto.descrizione,
        });
        this.metaService.updateTag({
          name: 'keywords',
          content:
            'Toner, Stampanti, Nastri, Compatibili, Th&S Bologna, Bologna, Soluzoini informatiche, Compuprint, Xerox, OKI',
        });
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: err.error.messaggio,
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

  faiInviareMail(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      accept: () => {
        this.router.navigateByUrl('/contatti');
      },
    });
  }

  aggiungiAlCarrello(event: Event) {
    event.stopImmediatePropagation();

    if (this.checkStorage()) {
      this.elementiCarrelloService
        .aggiungiElementoAlCarrello(sessionStorage.getItem('carrello'), this.prodotto.codice, this.quantita)
        .subscribe({
          next: (res: ResponseCustom) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successo',
              detail: res.messaggio,
              life: 2000,
            });

            this.carrelloAggiornato.emit();
            this.quantita = 1;
          },
        });
    } else {
      this.router.navigateByUrl('/shop/accedi');
    }
  }
}
