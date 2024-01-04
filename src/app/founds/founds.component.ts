import { Component } from '@angular/core';
import { StateService } from '../services/state.service';
import { SnackBarService } from '../services/snack-bar.service';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'investments-founds',
  templateUrl: './founds.component.html',
  styleUrls: ['./founds.component.scss']
})
export class FoundsComponent {
  dcc = this.stateService.dcc;

  get amount() {
    return this.stateService.amount;
  }

  set amount(amount: number) {
    this.stateService.amount = amount;
  }

  constructor(private stateService: StateService) { }
}
