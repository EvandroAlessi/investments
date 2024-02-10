import Dexie, { Table } from 'dexie';
import { InvestmentDistribution } from '../models/investment-distribution.model';
import { DistributedBy } from '../enums/distributed-by.enum';

const TABLE_NAME = 'investments';

export class IndexedDbService extends Dexie {
  investmentDistribution!: Table<InvestmentDistribution, number>;

  constructor() {
    super(TABLE_NAME);

    this.version(1).stores({
      investmentDistribution: '++id'
    });

    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.investmentDistribution.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Amount
    });

    await db.investmentDistribution.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Percentage
    });
  }
}

export const db = new IndexedDbService();
