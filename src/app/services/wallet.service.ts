import { Injectable } from '@angular/core';
import { db } from '../database/indexed-db';
import { Wallet } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  async getWallet(): Promise<Wallet> {
    return await db.wallets.get({ id: 1 })
      ?? <Wallet>{};
  }

  async updateWallet(wallet: Wallet): Promise<void>{
    await db.wallets.update(1 , wallet);
  }
}
