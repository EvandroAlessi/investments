import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Wallet } from 'src/app/models/wallet.model';
import { SynchronyService } from 'src/app/services/synchrony.service';
import { DISPLAY_PRICE_OPTIONS } from 'src/app/constants/display-price-options.constant';

@Component({
  selector: 'investments-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss']
})
export class FundComponent implements OnInit {
  displayPriceOptions = DISPLAY_PRICE_OPTIONS;
  wallet: Wallet = {
    availableFund: 0,
    dcc: 'R$'
  };

  @Output()
  isWalletFulfilled = new EventEmitter<boolean>();

  constructor(private walletService: WalletService,
    private synchronyService: SynchronyService) { }

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

    this.synchronyService.updateInvestmentTable();
  }
}
