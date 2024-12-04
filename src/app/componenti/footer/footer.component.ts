import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

import link from '../../dati/link-footer.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, DividerModule, ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  link!: MenuItem[]

  ngOnInit() {
    this.link = link as MenuItem[];
  }
}
