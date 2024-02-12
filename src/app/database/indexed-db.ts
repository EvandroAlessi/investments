import Dexie, { Table } from 'dexie';
import { Investment } from '../models/investment.model';
import { DistributedBy } from '../enums/distributed-by.enum';
import { Wallet } from '../models/wallet.model';

const TABLE_NAME = 'funddb';

export class IndexedDb extends Dexie {
  investments!: Table<Investment, number>;
  wallets!: Table<Wallet, number>;

  constructor() {
    super(TABLE_NAME);

    this.version(1).stores({
      investments: '++id',
      wallets: '++id'
    });

    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.investments.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Amount,
      isProjection: false
    });

    await db.investments.add({
      fixedIncome: 0,
      realState: 0,
      stockExchange: 0,
      internacional: 0,
      crypto: 0,
      distributedBy: DistributedBy.Percentage,
      isProjection: true
    });

    await db.wallets.add({
      availableFund: 0,
      dcc: 'R$'
    });
  }
}

export const db = new IndexedDb();
