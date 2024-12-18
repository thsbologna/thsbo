import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreak',
  standalone: true
})
export class LineBreakPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (!value) return value; // Se non c'è nulla, ritorna il valore originale
    return value.replace(/\|/g, '<br>');
  }

}
