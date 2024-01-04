import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { InvestmentType } from '../enums/investment-type.enum';
import { SnackBarService } from '../services/snack-bar.service';
import { INVESTMENT_TYPE_NAME } from '../consts/investment-name.const';
import { InvestmentService } from '../services/investment.service';
import { DistributedBy } from '../enums/distributed-by.enum';

@Component({
  selector: 'investments-founds-allocation',
  templateUrl: './founds-allocation.component.html',
  styleUrls: ['./founds-allocation.component.scss']
})
export class FoundsAllocationComponent implements OnInit {
  investmentType = InvestmentType;
  INVESTMENT_NAME = INVESTMENT_TYPE_NAME;
  bySelected = DistributedBy.Amount;

  @Input()
  isExpected: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private snackBarService: SnackBarService,
    private investmentService: InvestmentService) { }

  ngOnInit(): void {
    if (this.isExpected) {
      this.bySelected = DistributedBy.Percentage;
    }
  }

  setInvestmentDistribution(value: number, investmentType: InvestmentType): void {
    value = this.getAvailableValue(value, investmentType);

    switch (investmentType) {
      case InvestmentType.fixedIncome:
        this.investmentService.setFixedIncomeInvestmentDistribution(-1, this.isExpected);
        this.changeDetectorRef.detectChanges();

        this.investmentService.setFixedIncomeInvestmentDistribution(value, this.isExpected);
        break;
      case InvestmentType.realState:
        this.investmentService.setRealStateInvestmentDistribution(-1, this.isExpected);
        this.changeDetectorRef.detectChanges();

        this.investmentService.setRealStateInvestmentDistribution(value, this.isExpected);
        break;
      case InvestmentType.stockExchange:
        this.investmentService.setStockExchangeInvestmentDistribution(-1, this.isExpected);
        this.changeDetectorRef.detectChanges();

        this.investmentService.setStockExchangeInvestmentDistribution(value, this.isExpected);
        break;
      case InvestmentType.crypto:
        this.investmentService.setCryptoInvestmentDistribution(-1, this.isExpected);
        this.changeDetectorRef.detectChanges();

        this.investmentService.setCryptoInvestmentDistribution(value, this.isExpected);
        break;
      case InvestmentType.internacional:
        this.investmentService.setInternacionalInvestmentDistribution(-1, this.isExpected);
        this.changeDetectorRef.detectChanges();

        this.investmentService.setInternacionalInvestmentDistribution(value, this.isExpected);
        break;
    }

    this.changeDetectorRef.detectChanges();
  }

  bySelectedChanged(value: number) {
    this.bySelected = value;

    this.investmentService.clearInvestmentDistribution(this.isExpected, this.bySelected);
  }

  private getAvailableValue(value: number, investmentType: InvestmentType): number {
    const maxAvailable = this.investmentService.getMaxInvestmentAvailableByInvestmentType(investmentType, this.bySelected, this.isExpected);

    if (value >= maxAvailable) {
      return maxAvailable;
    }

    return value;
  }
}
