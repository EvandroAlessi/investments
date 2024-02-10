import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvestmentType } from '../../enums/investment-type.enum';
import { StateService } from '../../services/state.service';
import { MatSort } from '@angular/material/sort';
import { INVESTMENT_TYPE_NAME } from '../../consts/investment-name.const';
import { InvestmentService } from '../../services/investment.service';
import { CurrencyService } from '../../services/currency.service';
import { DistributedBy } from '../../enums/distributed-by.enum';

@Component({
  selector: 'investments-founds-distribution',
  templateUrl: './founds-distribution.component.html',
  styleUrls: ['./founds-distribution.component.scss']
})
export class FoundsDistributionComponent {
  dcc = this.stateService.dcc;
  displayedColumns: string[] = ['investmentType', 'percentage', 'expectedAmount', 'currentAmount', 'diff'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private stateService: StateService,
    private investmentService: InvestmentService,
    private currencyService: CurrencyService) { }

  async buildTable(): Promise<void> {
    const rows: any[] = [];

    for (let value in InvestmentType) {
      if (Number.isNaN(+value)) {
        continue;
      }

      const investmentType = +value;

      const expectedInvestmentDistribution = await this.investmentService.getInvestmentDistribution(true);
      const currentInvestmentDistribution = await this.investmentService.getInvestmentDistribution(false);

      const expectedInvestmentValue = (await this.investmentService.getInvestmentDistributionByInvestmentType(true))[investmentType as InvestmentType];
      const currentInvestmentValue = (await this.investmentService.getInvestmentDistributionByInvestmentType(false))[investmentType as InvestmentType];

      const percentage = expectedInvestmentDistribution.distributedBy == DistributedBy.Percentage
        ? expectedInvestmentValue
        : this.investmentService.convertToPercentage(expectedInvestmentValue);

      const expectedAmount = expectedInvestmentDistribution.distributedBy == DistributedBy.Amount
        ? expectedInvestmentValue
        : this.investmentService.convertToAmout(expectedInvestmentValue);

      const currentAmount = currentInvestmentDistribution.distributedBy == DistributedBy.Amount
        ? currentInvestmentValue
        : this.investmentService.convertToAmout(currentInvestmentValue);

      rows.push({
        investmentType: INVESTMENT_TYPE_NAME[investmentType as InvestmentType],
        percentage: percentage,
        expectedAmount: expectedAmount,
        currentAmount: currentAmount,
        diff: expectedAmount - currentAmount
      });
    }

    const dataSource = new MatTableDataSource(rows);
    dataSource.sort = this.sort;

    this.dataSource = dataSource;
  };

  formatCurrencyPontuation(amount: number): string {
    return this.currencyService.formatCurrencyPontuation(amount, this.dcc);
  }
}
