import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { InvestmentType } from '../enums/investment-type.enum';
import { DistributedBy } from '../enums/distributed-by.enum';
import { InvestmentDistribution } from '../models/investment-distribution.model';
import { db } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  constructor(private stateService: StateService) { }

  async getMaxInvestmentAvailableByInvestmentType(investmentType: InvestmentType, distributionBy: DistributedBy, isExpected: boolean): Promise<number> {
    const investmentDistribution = await this.getInvestmentDistributionByInvestmentType(isExpected);

    const currentdistribution = await this.getInvestimentDistributionSum(isExpected)
      - investmentDistribution[investmentType];

    if (distributionBy == DistributedBy.Percentage) {
      return 100 - currentdistribution;
    }

    return this.stateService.amount - currentdistribution;
  }

  async clearInvestmentDistribution(isExpected: boolean, distributedBy: DistributedBy): Promise<void> {
    const dsitribution: InvestmentDistribution = {
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      crypto: 0,
      internacional: 0,
      distributedBy: distributedBy
    };

    await this.updateInvestmentDistribution(isExpected, dsitribution);
  }

  async getInvestimentDistributionSum(isExpected: boolean): Promise<number> {
    var investmentDistribution = await this.getInvestmentDistributionByInvestmentType(isExpected);

    const sum = investmentDistribution[InvestmentType.fixedIncome]
      + investmentDistribution[InvestmentType.realState]
      + investmentDistribution[InvestmentType.stockExchange]
      + investmentDistribution[InvestmentType.crypto]
      + investmentDistribution[InvestmentType.internacional];

    return this.toFixedNumber(sum, 2);
  }

  async getInvestmentDistribution(isExpected: boolean): Promise<InvestmentDistribution> {
    if (isExpected) {
      return await this.getExpectedInvestmentDistributionFromDb();
    }

    return await this.getInvestmentDistributionFromDb();
  }

  async getInvestmentDistributionByInvestmentType(isExpected: boolean) {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);

    return {
      [InvestmentType.fixedIncome]: investmentDistribution.fixedIncome,
      [InvestmentType.realState]: investmentDistribution.realState,
      [InvestmentType.stockExchange]: investmentDistribution.stockExchange,
      [InvestmentType.crypto]: investmentDistribution.crypto,
      [InvestmentType.internacional]: investmentDistribution.internacional,
    };
  }

  async setFixedIncomeInvestmentDistribution(value: number, isExpected: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);
    investmentDistribution.fixedIncome = value;

    this.updateInvestmentDistribution(isExpected, investmentDistribution);
  }

  async setRealStateInvestmentDistribution(value: number, isExpected: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);
    investmentDistribution.realState = value;

    this.updateInvestmentDistribution(isExpected, investmentDistribution);
  }

  async setStockExchangeInvestmentDistribution(value: number, isExpected: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);
    investmentDistribution.stockExchange = value;

    this.updateInvestmentDistribution(isExpected, investmentDistribution);
  }

  async setCryptoInvestmentDistribution(value: number, isExpected: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);
    investmentDistribution.crypto = value;

    this.updateInvestmentDistribution(isExpected, investmentDistribution);
  }

  async setInternacionalInvestmentDistribution(value: number, isExpected: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestmentDistribution(isExpected);
    investmentDistribution.internacional = value;

    this.updateInvestmentDistribution(isExpected, investmentDistribution);
  }

  convertToAmout(percentageValue: number): number {
    const amount = percentageValue * this.stateService.amount / 100;

    return ~~amount;
  }

  convertToPercentage(amountValue: number): number {
    const amount = amountValue / this.stateService.amount * 100;

    return ~~amount;
  }

  private toFixedNumber(num: number, digits: number, base = 10) {
    const pow = Math.pow(base, digits);

    return Math.round(num * pow) / pow;
  }

  private async updateInvestmentDistribution(isExpected: boolean, investmentDistribution: InvestmentDistribution) {
    if (isExpected) {
      await db.investmentDistribution.update(2, investmentDistribution);

      return;
    }

    await db.investmentDistribution.update(1, investmentDistribution);
  }

  private async getInvestmentDistributionFromDb(): Promise<InvestmentDistribution> {
    return await db.investmentDistribution.get({ id: 1 }) ?? <InvestmentDistribution>{};
  }

  private async getExpectedInvestmentDistributionFromDb(): Promise<InvestmentDistribution> {
    return await db.investmentDistribution.get({ id: 2 }) ?? <InvestmentDistribution>{};
  }
}
