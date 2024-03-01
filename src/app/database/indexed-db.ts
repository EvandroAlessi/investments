import Dexie, { Table } from 'dexie';
import { Investment } from '../models/investment.model';
import { DistributedBy } from '../enums/distributed-by.enum';
import { Wallet } from '../models/wallet.model';
import { Goal } from '../models/goal.model';
import { Transaction } from '../models/transaction.model';

const TABLE_NAME = 'funddb';

export class IndexedDb extends Dexie {
  investments!: Table<Investment, number>;
  wallets!: Table<Wallet, number>;
  goals!: Table<Goal, number>;
  transactions!: Table<Transaction, number>;

  constructor() {
    super(TABLE_NAME);

    this.version(1).stores({
      investments: '++id',
      wallets: '++id',
      goals: '++id',
      transactions: '++id, goalId',
    });

    this.on('populate', () => this.populate());
  }

  async populate() { // not needed
    await INDEXED_DB.investments.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Amount,
      isProjection: false
    });

    await INDEXED_DB.investments.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Percentage,
      isProjection: true
    });

    await INDEXED_DB.wallets.add({
      availableFund: 0,
      dcc: 'R$'
    });

    var goalId = await INDEXED_DB.goals.add({
      currentAmount: 0,
      completed: true,
      name: 'Annual Saving',
      description: 'Description Test',
      startDate: new Date(),
      deadLine: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      totalCost: 2000
    });
  }
}

export const INDEXED_DB = new IndexedDb();
