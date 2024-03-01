import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SynchronyService } from '../../services/synchrony.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { InvestmentService } from '../../services/investment.service';
import { DistributedBy } from '../../enums/distributed-by.enum';
import { CurrencyService } from '../../services/currency.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'investments-distribution',
  templateUrl: './investments-distribution.component.html',
  styleUrls: ['./investments-distribution.component.scss']
})
export class InvestmentsDistributionComponent implements AfterViewInit {
  isFirstStepNextEnable = false;
  isSecondStepCompleted = false;
  isThirdStepCompleted = false;

  get isFourthStepCompleted() {
    return this.isThirdStepCompleted;
  }

  get isFifthStepCompleted() {
    return this.isFourthStepCompleted;
  }

  constructor(private synchronyService: SynchronyService,
    private walletService: WalletService,
    private investmentService: InvestmentService,
    private snackBarService: SnackBarService,
    private currencyService: CurrencyService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.synchronyService.setIsLoadingContent(false);
    }, 700);
  }

  selectionChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex != 3) {
      return;
    }

    this.synchronyService.updateInvestmentChart();
  }

  firstStepNextClick(): void {
    if (this.isFirstStepNextEnable) {
      return;
    }

    this.snackBarService.showSnackBarMessage('Founds must be bigger than zero', 5);
  }

  async secondStepNextClick(): Promise<void> {
    if (this.isSecondStepCompleted) {
      this.checkThirdStep();

      return;
    }

    const investmentDistribution = await this.investmentService.getInvestment(false);

    this.showDistributionMessage(investmentDistribution.distributedBy);
  }

  async thirdStepNextClick(): Promise<void> {
    if (this.isThirdStepCompleted) {
      this.synchronyService.updateInvestmentChart();
      this.synchronyService.updateInvestmentTable();

      return;
    }

    const investmentDistribution = await this.investmentService.getInvestment(true);

    this.showDistributionMessage(investmentDistribution.distributedBy);
  }

  async checkInvestmentDistribution(isInvestmentProjection: boolean): Promise<boolean> {
    const investmentDistribution = await this.investmentService.getInvestment(isInvestmentProjection);
    const sum = await this.investmentService.getInvestimentSum(isInvestmentProjection);

    if (investmentDistribution.distributedBy == DistributedBy.Percentage) {
      return sum == 100;
    }

    const wallet = await this.walletService.getWallet();

    return sum == wallet.availableFund;
  }

  async showDistributionMessage(distributedBy: DistributedBy) {
    if (distributedBy == DistributedBy.Percentage) {
      this.snackBarService.showSnackBarMessage('The distribution Sum must match 100%', 5);

      return;
    }

    const wallet = await this.walletService.getWallet();

    const formatedAmount = this.currencyService.formatCurrencyPontuation(wallet.availableFund, wallet.dcc);

    this.snackBarService.showSnackBarMessage(`The distribution Sum must match ${formatedAmount}`, 5);
  }

  async checkFirstStep(value: boolean): Promise<void> {
    this.isFirstStepNextEnable = value;

    await this.checkSecondStep();
    await this.checkThirdStep();

    this.changeDetectorRef.detectChanges();
  }

  async checkSecondStep(): Promise<void> {
    this.isSecondStepCompleted = this.isFirstStepNextEnable
      && await this.checkInvestmentDistribution(false);

    this.changeDetectorRef.detectChanges();
  }

  async checkThirdStep(): Promise<void> {
    this.isThirdStepCompleted = this.isSecondStepCompleted
      && await this.checkInvestmentDistribution(true);

    this.changeDetectorRef.detectChanges();
  }
}
