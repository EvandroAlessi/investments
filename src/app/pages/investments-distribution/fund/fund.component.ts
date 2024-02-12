import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Wallet } from 'src/app/models/wallet.model';

@Component({
  selector: 'investments-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss']
})
export class FundComponent implements OnInit {
  wallet: Wallet = {
    availableFund: 0,
    dcc: 'R$'
  };

  @Output()
  isWalletFulfilled = new EventEmitter<boolean>();

  constructor(private walletService: WalletService) { }

  async ngOnInit(): Promise<void> {
    this.wallet = await this.walletService.getWallet();

    this.emitWalletStatus();
  }

  async updateWallet(availableFund: number): Promise<void> {
    this.wallet.availableFund = availableFund;

    await this.walletService.updateWallet(this.wallet);

    this.emitWalletStatus();
  }

  private emitWalletStatus() {
    this.isWalletFulfilled.emit(this.wallet.availableFund > 0);
  }
}
