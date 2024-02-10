import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SynchronyService } from '../../services/synchrony.service';
import { StateService } from '../../services/state.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { InvestmentService } from '../../services/investment.service';
import { DistributedBy } from '../../enums/distributed-by.enum';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'investments-founds-stepper',
  templateUrl: './founds-stepper.component.html',
  styleUrls: ['./founds-stepper.component.scss']
})
export class FoundsStepperComponent implements OnInit {

  get isFirstStepNextEnable() {
    return this.stateService.amount > 0;
  };

  isSecondStepCompleted = false;

  isThirdStepCompleted = false;

  get isFourthStepCompleted() {
    return this.isThirdStepCompleted;
  }

  get isFifthStepCompleted() {
    return this.isFourthStepCompleted;
  }

  constructor(private synchronyService: SynchronyService,
    private stateService: StateService,
    private investmentService: InvestmentService,
    private snackBarService: SnackBarService,
    private currencyService: CurrencyService,
    private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.checkSecondStep();

    this.checkThirdStep();
  }

  selectionChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex != 3) {
      return;
    }

    this.synchronyService.updateChart();
  }

  firstStepNextClick(): void {
    if (this.isFirstStepNextEnable) {
      return;
    }

    this.snackBarService.showSnackBarMessage('Founds must be bigger than zero', 5);
  }

  async secondStepNextClick(): Promise<void> {
    if (this.isSecondStepCompleted) {
      return;
    }

    const investmentDistribution = await this.investmentService.getInvestmentDistribution(false);

    this.showDistributionMessage(investmentDistribution.distributedBy);
  }

  async thirdStepNextClick(): Promise<void> {
    if (this.isThirdStepCompleted) {
      return;
    }

    const investmentDistribution = await this.investmentService.getInvestmentDistribution(true);

    this.showDistributionMessage(investmentDistribution.distributedBy);
  }

  async checkInvestmentDistribution(isExpected: boolean): Promise<boolean> {
    const investmentDistribution = await this.investmentService.getInvestmentDistribution(isExpected);
    const sum = await this.investmentService.getInvestimentDistributionSum(isExpected);

    console.log('investmentDistribution', { investmentDistribution });
    console.log('sum', sum);

    if (investmentDistribution.distributedBy == DistributedBy.Percentage) {
      return sum == 100;
    }

    return sum == this.stateService.amount;
  }

  showDistributionMessage(distributedBy: DistributedBy): void {
    if (distributedBy == DistributedBy.Percentage) {
      this.snackBarService.showSnackBarMessage('The distribution Sum must match 100%', 5);

      return;
    }

    const formatedAmount = this.currencyService.formatCurrencyPontuation(this.stateService.amount, this.stateService.dcc);

    this.snackBarService.showSnackBarMessage(`The distribution Sum must match ${formatedAmount}`, 5);
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
