import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INVESTMENT_TYPE_NAME } from '../consts/investment-name.const';
import { StateService } from '../services/state.service';
import { InvestmentType } from '../enums/investment-type.enum';
import { InvestmentService } from '../services/investment.service';
import { CurrencyService } from '../services/currency.service';
import { DistributedBy } from '../enums/distributed-by.enum';

@Component({
  selector: 'investments-form-field-builder',
  templateUrl: './form-field-builder.component.html',
  styleUrls: ['./form-field-builder.component.scss']
})
export class FormFieldBuilderComponent {
  dcc = this.stateService.dcc;

  @Input()
  investmentType!: InvestmentType;

  @Input()
  bySelected = DistributedBy.Amount;

  @Input()
  isExpected: boolean = false;

  @Output()
  inputValueChange = new EventEmitter<number>();

  get investmentDistributionByType(): number {
    return this.investmentService.getInvestmentDistributionByInvestmentType(this.isExpected)[this.investmentType];
  }

  get investmentTypeName(): string {
    return INVESTMENT_TYPE_NAME[this.investmentType];
  }

  constructor(private stateService: StateService,
    private investmentService: InvestmentService,
    private currencyService: CurrencyService) { }

  updateInputValue(value: number): void {
    this.inputValueChange.emit(value);
  }

  showHintMessage(): boolean {
    if (this.investmentDistributionByType > 0) {
      return false;
    }

    if (this.bySelected == DistributedBy.Percentage) {
      return this.investmentService.getInvestimentDistributionSum(this.isExpected) < 100;
    }

    return this.investmentService.getInvestimentDistributionSum(this.isExpected) < this.stateService.amount;
  }

  hintMessage(): string {
    const maxAvailable = this.investmentService.getMaxInvestmentAvailableByInvestmentType(this.investmentType, this.bySelected, this.isExpected);

    if (this.bySelected == DistributedBy.Percentage) {
      return `Max ${maxAvailable}%`;
    }

    const maxAmountAvailable = this.currencyService.formatCurrencyPontuation(this.dcc, maxAvailable);

    return `Max ${maxAmountAvailable}`;
  }
}
