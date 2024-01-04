import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { InvestmentType } from '../enums/investment-type.enum';
import { DistributedBy } from '../enums/distributed-by.enum';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  constructor(private stateService: StateService) { }

  getMaxInvestmentAvailableByInvestmentType(investmentType: InvestmentType, distributionBy: DistributedBy, isExpected: boolean): number {
    const currentdistribution = this.getInvestimentDistributionSum(isExpected)
      - this.getInvestmentDistributionByInvestmentType(isExpected)[investmentType];

    if (distributionBy == DistributedBy.Percentage) {
      return 100 - currentdistribution;
    }

    return this.stateService.amount - currentdistribution;
  }

  clearInvestmentDistribution(isExpected: boolean, distributedBy: DistributedBy) {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution = {
        fixedIncome: 0,
        realState: 0,
        stockExchange: 0,
        crypto: 0,
        internacional: 0,
        distributedBy: distributedBy
      };

      return;
    }

    this.stateService.investmentDistribution = {
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      crypto: 0,
      internacional: 0,
      distributedBy: distributedBy
    };
  }

  getInvestimentDistributionSum(isExpected: boolean): number {
    return this.getInvestmentDistributionByInvestmentType(isExpected)[InvestmentType.fixedIncome]
      + this.getInvestmentDistributionByInvestmentType(isExpected)[InvestmentType.realState]
      + this.getInvestmentDistributionByInvestmentType(isExpected)[InvestmentType.stockExchange]
      + this.getInvestmentDistributionByInvestmentType(isExpected)[InvestmentType.crypto]
      + this.getInvestmentDistributionByInvestmentType(isExpected)[InvestmentType.internacional];
  }

  getInvestmentDistribution(isExpected: boolean) {
    if (isExpected) {
      return this.stateService.expectedInvestmentDistribution;
    }

    return this.stateService.investmentDistribution;
  }

  getInvestmentDistributionByInvestmentType(isExpected: boolean) {
    let investmentDistribution = this.getInvestmentDistribution(isExpected);

    return {
      [InvestmentType.fixedIncome]: investmentDistribution.fixedIncome,
      [InvestmentType.realState]: investmentDistribution.realState,
      [InvestmentType.stockExchange]: investmentDistribution.stockExchange,
      [InvestmentType.crypto]: investmentDistribution.crypto,
      [InvestmentType.internacional]: investmentDistribution.internacional,
    };
  }

  setFixedIncomeInvestmentDistribution(value: number, isExpected: boolean): void {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution.fixedIncome = value;

      return;
    }

    this.stateService.investmentDistribution.fixedIncome = value;
  }

  setRealStateInvestmentDistribution(value: number, isExpected: boolean): void {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution.realState = value;

      return;
    }

    this.stateService.investmentDistribution.realState = value;
  }

  setStockExchangeInvestmentDistribution(value: number, isExpected: boolean): void {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution.stockExchange = value;

      return;
    }

    this.stateService.investmentDistribution.stockExchange = value;
  }

  setCryptoInvestmentDistribution(value: number, isExpected: boolean): void {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution.crypto = value;

      return;
    }

    this.stateService.investmentDistribution.crypto = value;
  }

  setInternacionalInvestmentDistribution(value: number, isExpected: boolean): void {
    if (isExpected) {
      this.stateService.expectedInvestmentDistribution.internacional = value;

      return;
    }

    this.stateService.investmentDistribution.internacional = value;
  }

  convertToAmout(percentageValue: number): number {
    const amount = percentageValue * this.stateService.amount / 100;

    return ~~amount;
  }

  convertToPercentage(amountValue: number): number {
    const amount = amountValue / this.stateService.amount * 100;

    return ~~amount;
  }
}
