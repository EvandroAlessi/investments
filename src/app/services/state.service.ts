import { Injectable } from '@angular/core';
import { InvestmentDistribution } from '../models/investment-distribution.model';
import { DistributedBy } from '../enums/distributed-by.enum';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // private _investmentDistribution: InvestmentDistribution = {
  //   fixedIncome: 156082.04,
  //   realState: 50491.26,
  //   stockExchange: 9446.23,
  //   internacional: 0,
  //   crypto: 160.73,
  //   distributedBy: DistributedBy.Amount
  // };

  // private _expectedInvestmentDistribution: InvestmentDistribution = {
  //   fixedIncome: 50,
  //   realState: 25,
  //   stockExchange: 15,
  //   internacional: 5,
  //   crypto: 5,
  //   distributedBy: DistributedBy.Percentage
  // };

  private _amount = 216180.26;
  private _dcc = 'R$';

  constructor() { }

  // get investmentDistribution(): InvestmentDistribution {
  //   return this._investmentDistribution;
  // }

  // set investmentDistribution(investmentDistribution: InvestmentDistribution) {
  //   this._investmentDistribution = investmentDistribution;
  // }

  // get expectedInvestmentDistribution(): InvestmentDistribution {
  //   return this._expectedInvestmentDistribution;
  // }

  // set expectedInvestmentDistribution(investmentDistribution: InvestmentDistribution) {
  //   this._expectedInvestmentDistribution = investmentDistribution;
  // }

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
