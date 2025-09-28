// src/app/pipes/currency-colombian.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyColombian',
})
export class CurrencyColombianPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '$0';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num) || num < 0) {
      return '$0';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
}
