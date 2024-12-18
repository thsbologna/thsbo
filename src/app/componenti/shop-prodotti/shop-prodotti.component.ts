import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Prodotto } from '../../interfacce/prodotto';
import { ResponseCustom } from '../../interfacce/response-custom';
import { BaseService } from '../../servizi/base.service';
import { ProdottoService } from '../../servizi/prodotto.service';
import { Utente } from '../../interfacce/utente';
import { UtenteService } from '../../servizi/utente.service';
import { ElementiCarrelloService } from '../../servizi/elementi-carrello.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-shop-prodotti',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-prodotti.component.html',
  styleUrl: './shop-prodotti.component.css',
})
export class ShopProdottiComponent implements OnInit {
  @Output() carrelloAggiornato = new EventEmitter<any>();
  prodotti!: Prodotto[];
  layout: 'list' | 'grid' = 'list';
  baseUrl!: string;
  caricamento: boolean = false;

  constructor(
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private elementiCarrelloService: ElementiCarrelloService
  ) {}

  ngOnInit(): void {
    this.caricamento = true
    this.baseUrl = this.baseService.baseUrl + '/immagini';
    this.getAllProdotti();
  }

  getAllProdotti() {

    this.prodottoService.getAll().subscribe({
      next: (res: ResponseCustom) => {
        this.prodotti = res.data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: err.error.message,
          life: 3000,
        });
      },
    });

    this.caricamento = false;

  }

  faiInviareMail(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      accept: () => {
        this.route.navigateByUrl('/contatti');
      },
    });
  }

  aggiungiAlCarrello(event: Event, prodotto: Prodotto) {

    event.stopImmediatePropagation();

    this.caricamento = true;

    if (this.checkStorage()) {
      this.elementiCarrelloService
        .aggiungiElementoAlCarrello(sessionStorage.getItem('carrello'), prodotto.codice, 1)
        .subscribe({
          next: (res: ResponseCustom) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successo',
              detail: res.messaggio,
              life: 2000,
            });

            this.carrelloAggiornato.emit();
            this.caricamento = false;
          },
          error: (err: any) => {
            this.caricamento = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.messaggio,
              life: 3000,
            });
          }
        });
    } else {
      this.route.navigateByUrl('/shop/accedi');
    }
  }

  checkStorage() {
    return (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    );
  }
}
