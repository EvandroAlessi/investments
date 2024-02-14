import { Injectable } from '@angular/core';
import { INDEXED_DB } from '../database/indexed-db';
import { Wallet } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  async getWallet(): Promise<Wallet> {
    return await INDEXED_DB.wallets.get({ id: 1 })
      ?? <Wallet>{};
  }

  async updateWallet(wallet: Wallet): Promise<void>{
    await INDEXED_DB.wallets.update(1 , wallet);
  }
}
