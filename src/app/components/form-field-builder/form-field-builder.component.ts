import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INVESTMENT_TYPE_NAME } from '../../consts/investment-name.const';
import { StateService } from '../../services/state.service';
import { InvestmentType } from '../../enums/investment-type.enum';
import { InvestmentService } from '../../services/investment.service';
import { CurrencyService } from '../../services/currency.service';
import { DistributedBy } from '../../enums/distributed-by.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'investments-form-field-builder',
  templateUrl: './form-field-builder.component.html',
  styleUrls: ['./form-field-builder.component.scss']
})
export class FormFieldBuilderComponent implements OnInit {
  dcc = this.stateService.dcc;

  @Input()
  investmentType!: InvestmentType;

  @Input()
  bySelected = DistributedBy.Amount;

  @Input()
  isExpected: boolean = false;

  @Output()
  hasChanges = new EventEmitter<void>();

  @Input()
  updateMessages!: Observable<boolean>;

  showHintMessage = false;
  hintMessage: string | undefined;

  investmentDistributionByType: number | undefined;

  get investmentTypeName(): string {
    return INVESTMENT_TYPE_NAME[this.investmentType];
  }

  constructor(private stateService: StateService,
    private investmentService: InvestmentService,
    private currencyService: CurrencyService,
    private changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit() {
    const investmentDistribution = await this.investmentService.getInvestmentDistributionByInvestmentType(this.isExpected);

    this.investmentDistributionByType = investmentDistribution[this.investmentType];

    await this.updateHintMessage();

    this.updateMessages.subscribe(async () => {
      await this.updateHintMessage();
    });
  }

  async updateInputValue(value: number): Promise<void> {
    if (this.investmentDistributionByType == value) {
      return;
    }

    this.refreshValue();

    this.investmentDistributionByType = await this.getAvailableValue(value);

    switch (this.investmentType) {
      case InvestmentType.fixedIncome:
        await this.investmentService.setFixedIncomeInvestmentDistribution(this.investmentDistributionByType, this.isExpected);
        break;
      case InvestmentType.realState:
        await this.investmentService.setRealStateInvestmentDistribution(this.investmentDistributionByType, this.isExpected);
        break;
      case InvestmentType.stockExchange:
        await this.investmentService.setStockExchangeInvestmentDistribution(this.investmentDistributionByType, this.isExpected);
        break;
      case InvestmentType.crypto:
        await this.investmentService.setCryptoInvestmentDistribution(this.investmentDistributionByType, this.isExpected);
        break;
      case InvestmentType.internacional:
        await this.investmentService.setInternacionalInvestmentDistribution(this.investmentDistributionByType, this.isExpected);
        break;
    }

    this.hasChanges.emit();

    this.changeDetectorRef.detectChanges();
  }

  private async updateHintMessage() {
    await this.checkShowHintMessage();

    if (this.showHintMessage) {
      await this.buildHintMessage();
    }
  }

  private refreshValue(): void {
    this.investmentDistributionByType = undefined;

    this.changeDetectorRef.detectChanges();
  }

  private async getAvailableValue(value: number): Promise<number> {
    const maxAvailable = await this.investmentService
      .getMaxInvestmentAvailableByInvestmentType(this.investmentType, this.bySelected, this.isExpected);

    if (value >= maxAvailable) {
      return maxAvailable;
    }

    return value;
  }

  async checkShowHintMessage(): Promise<void> {
    if (this.investmentDistributionByType && this.investmentDistributionByType > 0) {
      this.showHintMessage = false;

      this.changeDetectorRef.detectChanges();

      return;
    }

    if (this.bySelected == DistributedBy.Percentage) {
      this.showHintMessage = await this.investmentService.getInvestimentDistributionSum(this.isExpected) < 100;

      this.changeDetectorRef.detectChanges();

      return;
    }

    this.showHintMessage = await this.investmentService.getInvestimentDistributionSum(this.isExpected) < this.stateService.amount;

    this.changeDetectorRef.detectChanges();
  }

  async buildHintMessage(): Promise<void> {
    const maxAvailable = await this.investmentService.getMaxInvestmentAvailableByInvestmentType(this.investmentType, this.bySelected, this.isExpected);

    if (this.bySelected == DistributedBy.Percentage) {
      this.hintMessage = `Max ${maxAvailable}%`;

      this.changeDetectorRef.detectChanges();

      return;
    }

    const maxAmountAvailable = this.currencyService.formatCurrencyPontuation(maxAvailable, this.dcc);

    this.hintMessage = `Max ${maxAmountAvailable}`;

    this.changeDetectorRef.detectChanges();
  }
}
