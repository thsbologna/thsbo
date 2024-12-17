import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from 'express';
import { BaseService } from '../../servizi/base.service';
import { OrdineService } from '../../servizi/ordine.service';
import { ResponseCustom } from '../../interfacce/response-custom';
import { CommonEngine } from '@angular/ssr';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-ordine-dettagli',
  standalone: true,
  imports: [RouterModule, CommonModule, DataViewModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './ordine-dettagli.component.html',
  styleUrl: './ordine-dettagli.component.css',
})
export class OrdineDettagliComponent implements OnInit {

  numero!: string;
  ordine!: any;
  elementiOrdine!: any[];
  baseUrl!: string;

  constructor(private ordineService: OrdineService, private route: ActivatedRoute, private baseService: BaseService) {

  }

  ngOnInit() {
    // Access the route parameter `numero`
    this.numero = this.route.snapshot.paramMap.get('numero')!;
    this.baseUrl = this.baseService.baseUrl + "/immagini";


    this.ordineService.getById(this.numero).subscribe({
      next: (res: ResponseCustom) => {
        console.log(res.data);
        this.ordine = res.data;
        this.elementiOrdine = this.ordine.elementi;
      },
    });
  }
}
