import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Carrello } from '../../interfacce/carrello';
import { ResponseCustom } from '../../interfacce/response-custom';
import { BaseService } from '../../servizi/base.service';
import { CarrelloService } from '../../servizi/carrello.service';
import { ElementiCarrelloService } from '../../servizi/elementi-carrello.service';
import { OrdineService } from '../../servizi/ordine.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Utente } from '../../interfacce/utente';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-shop-carrello',
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
  templateUrl: './shop-carrello.component.html',
  styleUrl: './shop-carrello.component.css',
})
export class ShopCarrelloComponent {
  @Output() carrelloAggiornato = new EventEmitter<any>();
  carrello!: Carrello;
  elementiCarrello: any;
  baseUrl!: string;
  caricamento: boolean = false;
  utente!: Utente;
  vecchiaQuantita: number = 0;

  constructor(
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private elementiCarrelloService: ElementiCarrelloService,
    private ordineService: OrdineService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.caricamento = true;
    this.baseUrl = this.baseService.baseUrl + '/immagini';
    this.getCarrello();
  }

  getCarrello() {
    if (this.authService.isLoggedIn()) {
      this.authService.checkSessionExpiry();
      this.utente =
        JSON.parse(sessionStorage.getItem('utente')!) ||
        JSON.parse(localStorage.getItem('utente')!);

      this.carrello = this.utente.carrello;
      this.elementiCarrello = this.carrello.elementi;
      this.caricamento = false;
    } else {
      this.authService.logout();
      this.caricamento = false;
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
    this.vecchiaQuantita = elementocarrello.quantita;
    elementocarrello.quantita++;

    if (this.authService.isLoggedIn()) {
      this.authService.checkSessionExpiry();
      this.modificaQuantita(elementocarrello);
    } else {
      this.authService.logout();
    }
  }

  decrementaQuantita(elementocarrello: any) {
    this.vecchiaQuantita = elementocarrello.quantita;
    this.caricamento = true;
    if (elementocarrello.quantita == 1) {
      this.rimuoviProdottoDalCarrello(elementocarrello);
    } else {
      elementocarrello.quantita--;
    }

    if (this.authService.isLoggedIn()) {
      this.authService.checkSessionExpiry();
      this.modificaQuantita(elementocarrello);
    } else {
      this.authService.logout();
    }
  }

  rimuoviProdottoDalCarrello(elementoCarrello: any) {
    this.caricamento = true;
    this.confirmationService.confirm({
      message: 'Sei sicuro/a di voler rimuovere il prodotto dal carrello?',
      header: 'Rimuovi prodotto',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.authService.isLoggedIn()) {
          this.authService.checkSessionExpiry();
          this.rimuoviProdotto(elementoCarrello);
        } else {
          this.authService.logout();
        }
      },
      reject: () => {
        this.caricamento = false;
      },
    });
  }

  creaOrdine() {
    this.confirmationService.confirm({
      header: 'Conferma Ordine',
      message:
        "Al momento il servizio di acquisto diretto dal sito non e' disponibile. Una volta confermato questo pop-up l'ordine verra' inoltrato e sarete contattati al piu' presto per organizzare la spedizione e la modalita' di pagamento. Come indirizzo di spedizione verranno utilizzati i dati forniti al momento della registrazione (via, civico, comune, provincia). Per modificare l'indirizzo di consegna si prega di contattarci tramite il servizio mail presente nella pagina contatti.",
      accept: () => {
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
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rifiutato',
          detail: "L'ordine non e' andato a buon fine",
        });
      },
    });
  }

  modificaQuantita(elementoCarrello: any) {
    this.elementiCarrelloService
      .aggiornaQuantitaElemento(
        JSON.parse(sessionStorage.getItem('utente')!).carrello.id,
        elementoCarrello.prodotto.codice,
        elementoCarrello.quantita
      )
      .subscribe({
        next: (res: ResponseCustom) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: res.messaggio,
            life: 3000,
          });

          this.utente.carrello = res.data;
          sessionStorage.setItem('utente', JSON.stringify(this.utente));
          localStorage.setItem('utente', JSON.stringify(this.utente));
          this.carrelloAggiornato.emit();

          this.carrello = { ...res.data };
          this.caricamento = false;
        },
        error: (err) => {
          this.caricamento = false;
          elementoCarrello.quantita = this.vecchiaQuantita;
          this.messageService.add({
            severity: 'error',
            summary: 'errore',
            detail: err.error.messaggio,
            life: 3000,
          });
        },
      });
  }

  rimuoviProdotto(elementoCarrello: any) {
    this.elementiCarrelloService
      .rimuoviElemento(this.carrello.id, elementoCarrello.prodotto.codice)
      .subscribe({
        next: (res: ResponseCustom) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: res.messaggio,
            life: 3000,
          });

          this.carrello = res.data;
          this.elementiCarrello = [...this.carrello.elementi];
          this.utente.carrello = res.data;
          sessionStorage.setItem('utente', JSON.stringify(this.utente));
          localStorage.setItem('utente', JSON.stringify(this.utente));
          this.carrelloAggiornato.emit();
          this.caricamento = false;
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
}
