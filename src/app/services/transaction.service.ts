import { Injectable } from '@angular/core';
import { INDEXED_DB } from '../database/indexed-db';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    transaction.id = await INDEXED_DB.transactions.add(transaction);

    return transaction;
  }

  async getTransaction(id: number): Promise<Transaction> {
    return await INDEXED_DB.transactions.get({ id: id })
      ?? <Transaction>{};
  }

  async getTransactionsByGoalId(goalId: number): Promise<Transaction[]> {
    return await INDEXED_DB.transactions.where({ goalId: goalId }).toArray()
      ?? <Transaction[]>{};
  }

  async updateTransaction(transaction: Transaction, transactionId: number): Promise<void> {
    await INDEXED_DB.transactions.update(transactionId, transaction);
  }
}
