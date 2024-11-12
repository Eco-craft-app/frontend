import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenNumber',
  standalone: true
})
export class ShortenNumberPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (!value) {
      return '0';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'; // np. 1.2M
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k'; // np. 1.2k
    } else {
      return value.toString(); // jeśli mniej niż 1000, to zwraca normalną liczbę
    }
  }
}
