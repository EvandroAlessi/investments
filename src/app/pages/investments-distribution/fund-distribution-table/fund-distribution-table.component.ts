import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { MatSort } from '@angular/material/sort';
import { INVESTMENT_TYPE_NAME } from '../../../consts/investment-name.const';
import { InvestmentService } from '../../../services/investment.service';
import { CurrencyService } from '../../../services/currency.service';
import { DistributedBy } from '../../../enums/distributed-by.enum';
import { WalletService } from 'src/app/services/wallet.service';
import { Wallet } from 'src/app/models/wallet.model';
import { Investment } from 'src/app/models/investment.model';

@Component({
  selector: 'investments-fund-distribution-table',
  templateUrl: './fund-distribution-table.component.html',
  styleUrls: ['./fund-distribution-table.component.scss']
})
export class FundsDistributionTableComponent implements OnInit {
  isDataLoaded = false;

  wallet!: Wallet;
  displayedColumns: string[] = ['investmentType', 'percentage', 'expectedAmount', 'currentAmount', 'diff'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private walletService: WalletService,
    private investmentService: InvestmentService,
    private currencyService: CurrencyService) { }

  async ngOnInit(): Promise<void> {
    await this.loadTableData();
  }

  async loadTableData(): Promise<void> {
    this.isDataLoaded = false;

    this.wallet = await this.walletService.getWallet();

    await this.buildTable();

    this.isDataLoaded = true;
  }

  private async buildTable(): Promise<void> {
    const rows: any[] = [];

    for (let value in InvestmentType) {
      if (Number.isNaN(+value)) {
        continue;
      }

      const investmentType = +value;

      const investment = await this.investmentService.getInvestment(false);
      const investmentProjection = await this.investmentService.getInvestment(true);

      const investmentValue = this.getInvestmentByType(investment, investmentType);
      const investmentProjectionValue = this.getInvestmentByType(investmentProjection, investmentType);

      const projectedPercentage = investmentProjection.distributedBy == DistributedBy.Percentage
        ? investmentProjectionValue
        : this.investmentService.convertAvailableToPercentage(investmentProjectionValue);

      const projectedAmount = investmentProjection.distributedBy == DistributedBy.Amount
        ? investmentProjectionValue
        : await this.investmentService.convertAvailableFundToAmout(investmentProjectionValue, true);

      const currentAmount = investment.distributedBy == DistributedBy.Amount
        ? investmentValue
        : await this.investmentService.convertAvailableFundToAmout(investmentValue, true);

      rows.push({
        investmentType: INVESTMENT_TYPE_NAME[investmentType as InvestmentType],
        percentage: projectedPercentage,
        expectedAmount: projectedAmount,
        currentAmount: currentAmount,
        diff: projectedAmount - currentAmount
      });
    }

    const dataSource = new MatTableDataSource(rows);
    dataSource.sort = this.sort;

    this.dataSource = dataSource;
  };


  private getInvestmentByType(investment: Investment, investmentType: InvestmentType): number {
    switch (investmentType) {
      case InvestmentType.fixedIncome:
        return investment.fixedIncome;
      case InvestmentType.realState:
        return investment.realState;
      case InvestmentType.stockExchange:
        return investment.stockExchange;
      case InvestmentType.crypto:
        return investment.crypto;
      case InvestmentType.internacional:
        return investment.internacional;
    }
  }

  formatCurrencyPontuation(amount: number): string {
    return this.currencyService.formatCurrencyPontuation(amount, this.wallet?.dcc);
  }
}
