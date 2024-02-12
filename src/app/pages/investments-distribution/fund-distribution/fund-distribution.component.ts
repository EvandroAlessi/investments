import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { INVESTMENT_TYPE_NAME } from '../../../consts/investment-name.const';
import { InvestmentService } from '../../../services/investment.service';
import { DistributedBy } from '../../../enums/distributed-by.enum';
import { Subject } from 'rxjs';
import { Investment } from 'src/app/models/investment.model';

@Component({
  selector: 'investments-fund-distribution',
  templateUrl: './fund-distribution.component.html',
  styleUrls: ['./fund-distribution.component.scss']
})
export class FundDistributionComponent implements OnInit {
  investmentType = InvestmentType;
  INVESTMENT_NAME = INVESTMENT_TYPE_NAME;
  distributedBy = DistributedBy.Amount;
  updateInputDetails = new Subject<boolean>();

  @Input()
  isInvestmentProjection: boolean = false;

  @Output()
  hasChanges = new EventEmitter<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private investmentService: InvestmentService) { }

  async ngOnInit(): Promise<void> {
    const investmentDistribution = await this.investmentService.getInvestment(this.isInvestmentProjection);

    this.distributedBy = investmentDistribution.distributedBy;

    this.changeDetectorRef.detectChanges();
  }

  emitChanges() {
    this.hasChanges.emit();

    this.updateInputDetails.next(true);
  }

  async distributedByChanged(value: number) {
    this.distributedBy = value;

    const convertedDistribution = await this.convertDistribution();

    await this.investmentService.updateInvestment(this.isInvestmentProjection, convertedDistribution);

    this.hasChanges.emit();
    this.updateInputDetails.next(true);
    this.changeDetectorRef.detectChanges();
  }

  private async convertDistribution(): Promise<Investment> {
    const previousDistribution = await this.investmentService.getInvestment(this.isInvestmentProjection);

    if (this.distributedBy == DistributedBy.Amount) {
      return {
        id: previousDistribution.id,
        fixedIncome: await this.investmentService.convertAvailableFundToAmout(previousDistribution.fixedIncome, false),
        realState: await this.investmentService.convertAvailableFundToAmout(previousDistribution.realState, false),
        stockExchange: await this.investmentService.convertAvailableFundToAmout(previousDistribution.stockExchange, false),
        crypto: await this.investmentService.convertAvailableFundToAmout(previousDistribution.crypto, false),
        internacional: await this.investmentService.convertAvailableFundToAmout(previousDistribution.internacional, false),
        distributedBy: this.distributedBy,
        isProjection: this.isInvestmentProjection
      };
    }

    return {
      id: previousDistribution.id,
      fixedIncome: await this.investmentService.convertAvailableToPercentage(previousDistribution.fixedIncome),
      realState: await this.investmentService.convertAvailableToPercentage(previousDistribution.realState),
      stockExchange: await this.investmentService.convertAvailableToPercentage(previousDistribution.stockExchange),
      crypto: await this.investmentService.convertAvailableToPercentage(previousDistribution.crypto),
      internacional: await this.investmentService.convertAvailableToPercentage(previousDistribution.internacional),
      distributedBy: this.distributedBy,
      isProjection: this.isInvestmentProjection
    };
  }
}
