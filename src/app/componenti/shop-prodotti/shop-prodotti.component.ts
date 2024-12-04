import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-shop-prodotti',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shop-prodotti.component.html',
  styleUrl: './shop-prodotti.component.css',
})
export class ShopProdottiComponent implements OnInit {
  prodotti!: Prodotto[];
  layout: 'list' | 'grid' = 'list';
  baseUrl!: string;

  constructor(
    private prodottoService: ProdottoService,
    private baseService: BaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.baseUrl = this.baseService.baseUrl + '/immagini';
    this.getAll();
  }

  getAll() {
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
  }

  faiInviareMail(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      accept: () => {
        this.route.navigateByUrl('/contatti');
      },
    });
  }
}
