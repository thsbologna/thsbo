import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  baseUrl: string = 'https://thsbologna.it:8585/api';

  constructor() { }
}