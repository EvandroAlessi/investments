import { Injectable } from '@angular/core';
import { InvestmentDistribution } from '../models/investment-distribution.model';
import { DistributedBy } from '../enums/distributed-by.enum';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _investmentDistribution: InvestmentDistribution = {
    fixedIncome: 192973.51,
    realState: 28936.64,
    stockExchange: 0,
    crypto: 100.04,
    internacional: 0,
    distributedBy: DistributedBy.Amount
  };

  private _expectedInvestmentDistribution: InvestmentDistribution = {
    fixedIncome: 50,
    realState: 20,
    stockExchange: 20,
    crypto: 5,
    internacional: 5,
    distributedBy: DistributedBy.Percentage
  };

  private _amount = 222010.19;
  private _dcc = 'R$';

  constructor() { }

  get investmentDistribution(): InvestmentDistribution {
    return this._investmentDistribution;
  }

  set investmentDistribution(investmentDistribution: InvestmentDistribution) {
    this._investmentDistribution = investmentDistribution;
  }

  get expectedInvestmentDistribution(): InvestmentDistribution {
    return this._expectedInvestmentDistribution;
  }

  set expectedInvestmentDistribution(investmentDistribution: InvestmentDistribution) {
    this._expectedInvestmentDistribution = investmentDistribution;
  }
  get amount(): number {
    return this._amount;
  }

  set amount(amount: number) {
    this._amount = amount;
  }

  get dcc(): string {
    return this._dcc;
  }

  set dcc(amount: string) {
    this._dcc = amount;
  }
}
