import { Component, OnInit } from '@angular/core';
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
  carrello!: Carrello;
  elementiCarrello: any;
  baseUrl!: string;

  constructor(
    private carrelloService: CarrelloService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private elementiCarrelloService: ElementiCarrelloService,
    private ordineService: OrdineService
  ) {}

  ngOnInit(): void {
    this.baseUrl = this.baseService.baseUrl + '/immagini';
    this.getCarrello();
  }

  getCarrello() {
    if (this.checkStorage()) {
      this.carrelloService
        .getById(sessionStorage.getItem('carrello'))
        .subscribe({
          next: (res: ResponseCustom) => {
            this.carrello = res.data;
            this.elementiCarrello = this.carrello.elementi;
            console.log(this.elementiCarrello);
          },
          error: (err: any) => {},
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
    elementocarrello.quantita++;

    if (this.checkStorage())
      this.elementiCarrelloService
        .aggiornaQuantitaElemento(
          sessionStorage.getItem('carrello'),
          elementocarrello.prodotto.codice,
          elementocarrello.quantita
        )
        .subscribe({
          next: (res: ResponseCustom) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successo',
              detail: res.messaggio,
              life: 3000,
            });

            this.carrello = { ...res.data };
          },
          error: (res) => {
            elementocarrello.quantita--;
          },
        });
  }

  decrementaQuantita(elementocarrello: any) {
    if (elementocarrello.quantita == 1) {
      this.rimuoviElementoDalCarrello(elementocarrello);
    } else {
      elementocarrello.quantita--;

      if (this.checkStorage())
        this.elementiCarrelloService
          .aggiornaQuantitaElemento(
            sessionStorage.getItem('carrello'),
            elementocarrello.prodotto.codice,
            elementocarrello.quantita
          )
          .subscribe({
            next: (res: ResponseCustom) => {

              this.carrello = { ...res.data };

              this.messageService.add({
                severity: 'success',
                summary: 'Successo',
                detail: res.messaggio,
                life: 3000,
              });
            },
            error: (res) => {
              elementocarrello.quantita++;
            },
          });
    }
  }

  rimuoviElementoDalCarrello(elementocarrello: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler rimuovere il prodotto dal carrello?',
      header: 'Rimuovi prodotto',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // servizio rimozione prodotto
        if (this.checkStorage()) {
          this.elementiCarrelloService.rimuoviElemento(sessionStorage.getItem('carrello'), elementocarrello.prodotto.codice).subscribe({
            next: (res: ResponseCustom) => {
              this.carrello = res.data;
              this.elementiCarrello = [...this.carrello.elementi]

              this.messageService.add({
                severity: 'success',
                summary: 'Successo',
                detail: res.messaggio,
                life: 3000,
              });
            }
          })
        }
      },
    });
  }

  creaOrdine() {

    if(this.checkStorage()) {
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
        }
      })
    }
  }
}
