import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor() { }

  formatCurrencyPontuation(dcc: string, amount: number) {
    const truncAmount = ~~amount;
    const amountString = this.reverseString(truncAmount.toString());
    const thousand: string[] = [];

    for (let index = 0; index < amountString.length; index++) {

      if ((index + 1) % 3 == 0) {
        const substring = amountString.substring(index - 2, index + 1);

        thousand.push(this.reverseString(substring));

        continue;
      }

      if (index + 1 >= amountString.length) {
        if (index % 3 == 0) {
          const substring = amountString.substring(index, index + 2);

          thousand.push(this.reverseString(substring));

          continue;
        }

        const substring = amountString.substring(index - 1, index + 2);

        thousand.push(this.reverseString(substring));
      }
    }

    var decimalAmount = Math.abs(amount) - Math.abs(truncAmount);

    const thousandJoined = thousand.reverse().join('.');

    if (decimalAmount == 0) {
      return `${dcc} ${thousandJoined}`;
    }

    const decimalAmountString = decimalAmount
      .toFixed(2)
      .toString()
      .replace('0.', '');

    return `${dcc} ${thousandJoined},${decimalAmountString}`;
  }

  private reverseString(str: string): string {
    let reverseString: string = '';

    for (let char of str) {
      reverseString = char + reverseString;
    }

    return reverseString;
  }
}
