import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INVESTMENT_TYPE_NAME } from '../../../consts/investment-name.const';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { InvestmentService } from '../../../services/investment.service';
import { CurrencyService } from '../../../services/currency.service';
import { DistributedBy } from '../../../enums/distributed-by.enum';
import { Observable } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import { Wallet } from 'src/app/models/wallet.model';

@Component({
  selector: 'investments-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit {
  wallet: Wallet = {
    availableFund: 0,
    dcc: 'R$'
  };

  @Input()
  investmentType!: InvestmentType;

  @Input()
  distributedBy = DistributedBy.Amount;

  @Input()
  isInvestmentProjection: boolean = false;

  @Input()
  updateDetails!: Observable<boolean>;

  @Output()
  hasChanges = new EventEmitter<void>();

  showHintMessage = false;
  hintMessage: string | undefined;

  investmentDistributionByType: number | undefined;

  get investmentTypeName(): string {
    return INVESTMENT_TYPE_NAME[this.investmentType];
  }

  constructor(private walletService: WalletService,
    private investmentService: InvestmentService,
    private currencyService: CurrencyService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.wallet = await this.walletService.getWallet();

    await this.updateInputDetails();

    this.updateDetails.subscribe(async () => {
      await this.updateInputDetails();
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
        await this.investmentService.setFixedIncomeInvestment(this.investmentDistributionByType, this.isInvestmentProjection);
        break;
      case InvestmentType.realState:
        await this.investmentService.setRealStateInvestment(this.investmentDistributionByType, this.isInvestmentProjection);
        break;
      case InvestmentType.stockExchange:
        await this.investmentService.setStockExchangeInvestment(this.investmentDistributionByType, this.isInvestmentProjection);
        break;
      case InvestmentType.crypto:
        await this.investmentService.setCryptoInvestment(this.investmentDistributionByType, this.isInvestmentProjection);
        break;
      case InvestmentType.internacional:
        await this.investmentService.setInternacionalInvestment(this.investmentDistributionByType, this.isInvestmentProjection);
        break;
    }

    this.hasChanges.emit();

    this.changeDetectorRef.detectChanges();
  }

  private async updateInputDetails() {
    const investmentDistribution = await this.investmentService.getInvestmentByType(this.isInvestmentProjection);

    this.investmentDistributionByType = investmentDistribution[this.investmentType];

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
      .getMaxAvailableInvestmentByType(this.investmentType, this.distributedBy, this.isInvestmentProjection);

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

    if (this.distributedBy == DistributedBy.Percentage) {
      const percentegeDistributionSum = await this.investmentService.getInvestimentSum(this.isInvestmentProjection);

      this.showHintMessage = percentegeDistributionSum < 100;

      this.changeDetectorRef.detectChanges();

      return;
    }

    this.wallet = await this.walletService.getWallet();

    const distributionSum = await this.investmentService.getInvestimentSum(this.isInvestmentProjection);

    this.showHintMessage = distributionSum < this.wallet.availableFund;

    this.changeDetectorRef.detectChanges();
  }

  async buildHintMessage(): Promise<void> {
    const maxAvailable = await this.investmentService.getMaxAvailableInvestmentByType(this.investmentType, this.distributedBy, this.isInvestmentProjection);

    if (this.distributedBy == DistributedBy.Percentage) {
      this.hintMessage = `Max ${maxAvailable}%`;

      this.changeDetectorRef.detectChanges();

      return;
    }

    const maxAmountAvailable = this.currencyService.formatCurrencyPontuation(maxAvailable, this.wallet.dcc);

    this.hintMessage = `Max ${maxAmountAvailable}`;

    this.changeDetectorRef.detectChanges();
  }
}
