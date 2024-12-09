import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  baseUrl: string = 'http://192.168.1.177:8585/api';

  constructor() { }
}
