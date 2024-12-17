import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { OrdineService } from '../../servizi/ordine.service';
import { MessageService } from 'primeng/api';
import { ResponseCustom } from '../../interfacce/response-custom';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [ToastModule, TableModule, ButtonModule, TagModule, CommonModule, RouterModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './ordini.component.html',
  styleUrl: './ordini.component.css',
})
export class OrdiniComponent implements OnInit {
  ordini: any;
  expandedRows: any = {};

  constructor(
    private ordineService: OrdineService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllOrdini();
  }
  // Expand all rows
  expandAll() {
    this.expandedRows = this.ordini.reduce((acc: any, ordine: any) => {
      acc[ordine.id] = true; // Mark each row as expanded
      return acc;
    }, {});
  }

  // Collapse all rows
  collapseAll() {
    this.expandedRows = {}; // Clear the expanded rows
  }

  // Called when a row is expanded
  onRowExpand(event: any) {
    this.expandedRows[event.data.id] = true; // Mark the expanded row
    this.messageService.add({
      severity: 'info',
      summary: 'Product Expanded',
      detail: event.data.id,
      life: 3000,
    });
  }

  // Called when a row is collapsed
  onRowCollapse(event: any) {
    delete this.expandedRows[event.data.id]; // Remove the collapsed row
    this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000,
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
    }

    return 'danger';
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
    }

    return 'danger';
  }

  checkStorage() {
    return (
      typeof window !== 'undefined' &&
      (sessionStorage!.getItem('utente') != null ||
        localStorage!.getItem('utente') != null)
    );
  }

  getAllOrdini() {
    if (this.checkStorage()) {
      var id;

      if (sessionStorage.getItem('utente') !== null) {
        id = sessionStorage.getItem('utente');
      } else {
        id = localStorage.getItem('utente');
      }

      this.ordineService.getByUtente(id).subscribe({
        next: (res: ResponseCustom) => {
          this.ordini = res.data;

          console.log(this.ordini);
        },
      });
    }
  }
}
