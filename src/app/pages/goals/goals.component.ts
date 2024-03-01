import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Goal } from 'src/app/models/goal.model';
import { GoalService } from 'src/app/services/goal.service';
import { SynchronyService } from 'src/app/services/synchrony.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Wallet } from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DISPLAY_PRICE_OPTIONS } from 'src/app/constants/display-price-options.constant';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'investments-goals',
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  imports: [
    MatExpansionModule,
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CurrencyMaskModule,
    MatProgressBarModule
  ]
})
export class GoalsComponent implements OnInit {
  displayPriceOptions = DISPLAY_PRICE_OPTIONS;
  goals: Goal[] | undefined;
  editingList: { key: number, value: boolean; }[] = [];
  wallet: Wallet = {
    availableFund: 0,
    dcc: 'R$'
  };

  lastGoalCreated: number | undefined;
  transaction: Transaction | undefined;

  constructor(private goalService: GoalService,
    private synchronyService: SynchronyService,
    private walletService: WalletService,
    private transactionService: TransactionService) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.setGoals(),
      this.setWallet()
    ]);

    setTimeout(() => {
      this.synchronyService.setIsLoadingContent(false);
    }, 700);
  }

  isEditing(goalId: number | undefined): boolean {
    if (this.lastGoalCreated == goalId) {
      return true;
    }

    return this.editingList.find(x => x.key == goalId)?.value
      ?? false;
  }

  enableGoalEditing(goalId: number | undefined): void {
    this.setIsGoalEditing(goalId, true);

    this.editingList.push({ key: goalId!, value: true });
  }

  async saveGoal(goal: Goal): Promise<void> {
    this.setIsGoalEditing(goal.id, false);

    await this.goalService.updateGoal(goal, goal.id!);
  }

  async createGoal() {
    const goal = await this.goalService.createEmptyGoal();

    this.goals?.push(goal);

    this.lastGoalCreated = goal.id;
  }

  isLastGoalCreated(goalId: number | undefined): boolean {
    return this.lastGoalCreated == goalId;
  }

  getPercentage(goal: Goal): number {
    if (goal.completed) {
      return 100;
    }

    if (goal.totalCost == 0) {
      return 0;
    }

    return ~~(goal.currentAmount / goal.totalCost * 100);
  }

  getMonthSaving(goal: Goal): string {
    var monthDiff = goal.deadLine.getMonth() - goal.startDate.getMonth() +
      (12 * (goal.deadLine.getFullYear() - goal.startDate.getFullYear()));

    var value = (goal.totalCost / monthDiff).toFixed(2);

    return value
      .replaceAll(',', '')
      .replaceAll('.', ','); // To R$
  }

  updateCurrentAmout(goal: Goal, currentAmount: number) {
    if (goal.currentAmount === currentAmount) {
      return;
    }

    this.createTransaction(goal.id);

    if (!this.transaction) {
      return;
    }

    if (goal.currentAmount < currentAmount) {
      this.transaction.transactionValue = currentAmount - goal.currentAmount;
    } else {
      this.transaction.transactionValue = goal.currentAmount - currentAmount;
    }

    this.saveTransaction(goal);
  }

  async addTransactionToCurrentAmout(goal: Goal, transactionValue: number): Promise<void> {
    goal.currentAmount += transactionValue;

    goal.completed = goal.currentAmount >= goal.totalCost;

    this.goalService.updateGoal(goal, goal.id!);
  }

  createTransaction(goalId: number | undefined): void {
    this.transaction = {
      goalId: goalId,
      trasactionDate: new Date(),
      transactionValue: 0
    };
  }

  async saveTransaction(goal: Goal): Promise<void> {
    if (!this.transaction) {
      return;
    }

    await this.transactionService.createTransaction(this.transaction);

    await this.addTransactionToCurrentAmout(goal, this.transaction.transactionValue);

    this.transaction = undefined;
  }

  private setIsGoalEditing(goalId: number | undefined, isEditing: boolean): void {
    if (this.lastGoalCreated == goalId) {
      this.lastGoalCreated = undefined;
    }

    const isGoalEditing = this.editingList.find(x => x.key == goalId);

    if (isGoalEditing) {
      isGoalEditing.value = isEditing;

      return;
    }

    if (isEditing) {
      this.editingList.push({ key: goalId!, value: isEditing });
    }
  }

  private async setGoals(): Promise<void> {
    this.goals = await this.goalService.getAllGoals();

    this.sortGoals();
  }

  private async setWallet(): Promise<void> {
    this.wallet = await this.walletService.getWallet();
  }

  private sortGoals() {
    this.goals?.sort((goalA, goalB) => Number(goalB.completed) - Number(goalA.completed));
  }
}
