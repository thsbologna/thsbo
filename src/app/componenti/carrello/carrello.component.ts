import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CarrelloService } from '../../servizi/carrello.service';
import { ResponseCustom } from '../../interfacce/response-custom';
import { Carrello } from '../../interfacce/carrello';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BaseService } from '../../servizi/base.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ElementiCarrelloService } from '../../servizi/elementi-carrello.service';
import { OrdineService } from '../../servizi/ordine.service';
import { rejects } from 'assert';
import { error } from 'console';

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule,
    TagModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ProgressSpinnerModule,
    InputNumberModule,
    FormsModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.css',
})
export class CarrelloComponent implements OnInit {
  @Output() carrelloAggiornato = new EventEmitter<any>();
  carrello!: Carrello;
  elementiCarrello: any;
  baseUrl!: string;
  caricamento: boolean = false;

  constructor(
    private carrelloService: CarrelloService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private elementiCarrelloService: ElementiCarrelloService,
    private ordineService: OrdineService
  ) {}

  ngOnInit(): void {
    this.caricamento = true;
    this.baseUrl = this.baseService.baseUrl + '/immagini';
    this.getCarrello();
    this.caricamento = false;
  }

  getCarrello() {
    if (this.checkStorage()) {
      this.carrelloService
        .getById(sessionStorage.getItem('carrello'))
        .subscribe({
          next: (res: ResponseCustom) => {
            this.carrello = res.data;
            this.elementiCarrello = this.carrello.elementi;
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
  }

  checkStorage() {
    return (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    );
  }

  incrementaQuantita(elementocarrello: any) {
    this.caricamento = true;
    elementocarrello.quantita++;

    if (this.checkStorage()) {
      this.elementiCarrelloService
        .aggiornaQuantitaElemento(
          sessionStorage.getItem('carrello'),
          elementocarrello.prodotto.codice,
          elementocarrello.quantita
        )
        .subscribe({
          next: (res: ResponseCustom) => {
            this.carrelloAggiornato.emit();
            this.caricamento = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successo',
              detail: res.messaggio,
              life: 3000,
            });

            this.carrello = { ...res.data };
          },
          error: (err) => {
            this.caricamento = false;
            elementocarrello.quantita--;
            this.messageService.add({
              severity: 'error',
              summary: 'errore',
              detail: err.error.messaggio,
              life: 3000,
            });
          },
        });
    } else {
      this.caricamento = false;
    }
  }

  decrementaQuantita(elementocarrello: any) {
    this.caricamento = true;
    if (elementocarrello.quantita == 1) {
      this.rimuoviElementoDalCarrello(elementocarrello);
    } else {
      elementocarrello.quantita--;

      if (this.checkStorage()) {
        this.elementiCarrelloService
          .aggiornaQuantitaElemento(
            sessionStorage.getItem('carrello'),
            elementocarrello.prodotto.codice,
            elementocarrello.quantita
          )
          .subscribe({
            next: (res: ResponseCustom) => {
              this.caricamento = false;
              this.carrello = { ...res.data };
              this.carrelloAggiornato.emit();
              this.messageService.add({
                severity: 'success',
                summary: 'Successo',
                detail: res.messaggio,
                life: 3000,
              });
            },
            error: (err) => {
              this.caricamento = false;
              elementocarrello.quantita++;
              this.messageService.add({
                severity: 'error',
                summary: 'errore',
                detail: err.error.messaggio,
                life: 3000,
              });
            },
          });
      } else {
        this.caricamento = false;
      }
    }
  }

  rimuoviElementoDalCarrello(elementocarrello: any) {
    this.caricamento = true;
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler rimuovere il prodotto dal carrello?',
      header: 'Rimuovi prodotto',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // servizio rimozione prodotto
        if (this.checkStorage()) {
          this.elementiCarrelloService
            .rimuoviElemento(
              sessionStorage.getItem('carrello'),
              elementocarrello.prodotto.codice
            )
            .subscribe({
              next: (res: ResponseCustom) => {
                this.carrelloAggiornato.emit();
                this.carrello = res.data;
                this.elementiCarrello = [...this.carrello.elementi];
                this.caricamento = false;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successo',
                  detail: res.messaggio,
                  life: 3000,
                });
              },
              error: (err: any) => {
                this.caricamento = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'errore',
                  detail: err.error.messaggio,
                  life: 3000,
                });
              },
            });
        }
      },
      reject: () => {
        this.caricamento = false;
      },
    });
  }

  creaOrdine() {
    if (this.checkStorage()) {
      let id =
        sessionStorage!.getItem('utente') !== null
          ? sessionStorage!.getItem('utente')
          : localStorage.getItem('utente');

      this.ordineService.creaOrdine(id).subscribe({
        next: (res: ResponseCustom) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: res.messaggio,
            life: 3000,
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
  }
}
