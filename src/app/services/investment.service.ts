import { Injectable } from '@angular/core';
import { InvestmentType } from '../enums/investment-type.enum';
import { DistributedBy } from '../enums/distributed-by.enum';
import { Investment } from '../models/investment.model';
import { INDEXED_DB } from '../database/indexed-db';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  constructor(private walletService: WalletService) { }

  async getMaxAvailableInvestmentByType(investmentType: InvestmentType, distributionBy: DistributedBy, isInvestmentProjection: boolean): Promise<number> {
    const investmentDistribution = await this.getInvestmentByType(isInvestmentProjection);

    const currentdistribution = await this.getInvestimentSum(isInvestmentProjection)
      - investmentDistribution[investmentType];

    if (distributionBy == DistributedBy.Percentage) {
      return 100 - currentdistribution;
    }

    const wallet = await this.walletService.getWallet();

    const maxValue = wallet.availableFund - currentdistribution;

    if (maxValue >= 0) {
      return maxValue;
    }

    return 0;
  }

  async getInvestimentSum(isInvestmentProjection: boolean): Promise<number> {
    var investmentDistribution = await this.getInvestmentByType(isInvestmentProjection);

    const sum = investmentDistribution[InvestmentType.fixedIncome]
      + investmentDistribution[InvestmentType.realState]
      + investmentDistribution[InvestmentType.stockExchange]
      + investmentDistribution[InvestmentType.crypto]
      + investmentDistribution[InvestmentType.internacional];

    return this.toFixedNumber(sum, 2);
  }

  async getInvestment(isInvestmentProjection: boolean): Promise<Investment> {
    if (isInvestmentProjection) {
      return await this.getInvestmentProjectionFromDb();
    }

    return await this.getInvestmentFromDb();
  }

  async getInvestmentByType(isInvestmentProjection: boolean) {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);

    return {
      [InvestmentType.fixedIncome]: investmentDistribution.fixedIncome,
      [InvestmentType.realState]: investmentDistribution.realState,
      [InvestmentType.stockExchange]: investmentDistribution.stockExchange,
      [InvestmentType.crypto]: investmentDistribution.crypto,
      [InvestmentType.internacional]: investmentDistribution.internacional,
    };
  }

  async setFixedIncomeInvestment(value: number, isInvestmentProjection: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);
    investmentDistribution.fixedIncome = value;

    await this.updateInvestment(isInvestmentProjection, investmentDistribution);
  }

  async setRealStateInvestment(value: number, isInvestmentProjection: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);
    investmentDistribution.realState = value;

    await this.updateInvestment(isInvestmentProjection, investmentDistribution);
  }

  async setStockExchangeInvestment(value: number, isInvestmentProjection: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);
    investmentDistribution.stockExchange = value;

    await this.updateInvestment(isInvestmentProjection, investmentDistribution);
  }

  async setCryptoInvestment(value: number, isInvestmentProjection: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);
    investmentDistribution.crypto = value;

    await this.updateInvestment(isInvestmentProjection, investmentDistribution);
  }

  async setInternacionalInvestment(value: number, isInvestmentProjection: boolean): Promise<void> {
    let investmentDistribution = await this.getInvestment(isInvestmentProjection);
    investmentDistribution.internacional = value;

    await this.updateInvestment(isInvestmentProjection, investmentDistribution);
  }

  async updateInvestment(isInvestmentProjection: boolean, investmentDistribution: Investment) {
    if (isInvestmentProjection) {
      await INDEXED_DB.investments.update(2, investmentDistribution);

      return;
    }

    await INDEXED_DB.investments.update(1, investmentDistribution);
  }

  async convertAvailableFundToAmout(percentageValue: number, shouldRoundValue: boolean): Promise<number> {
    const wallet = await this.walletService.getWallet();

    const amount = percentageValue * wallet.availableFund / 100;

    if (shouldRoundValue) {
      return ~~amount;
    }

    return amount;
  }

  async convertAvailableToPercentage(amountValue: number): Promise<number> {
    const wallet = await this.walletService.getWallet();

    const percentage = amountValue / wallet.availableFund * 100;

    if (percentage > 100) {
      return 100;
    }

    return ~~percentage;
  }

  private toFixedNumber(num: number, digits: number, base = 10) {
    const pow = Math.pow(base, digits);

    return Math.round(num * pow) / pow;
  }

  private async getInvestmentFromDb(): Promise<Investment> {
    return await INDEXED_DB.investments.get({ id: 1 })
      ?? <Investment>{ distributedBy: DistributedBy.Amount };
  }

  private async getInvestmentProjectionFromDb(): Promise<Investment> {
    return await INDEXED_DB.investments.get({ id: 2 })
      ?? <Investment>{ distributedBy: DistributedBy.Percentage };
  }
}
