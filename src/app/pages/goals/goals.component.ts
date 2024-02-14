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
  ]
})
export class GoalsComponent implements OnInit {
  goals: Goal[] | undefined;
  editingList: { key: number, value: boolean; }[] = [];
  wallet: Wallet = {
    availableFund: 0,
    dcc: 'R$'
  };

  constructor(private goalService: GoalService,
    private synchronyService: SynchronyService,
    private walletService: WalletService) { }

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

    this.setIsGoalEditing(goal.id, true);
  }

  private setIsGoalEditing(goalId: number | undefined, isEditing: boolean): void {
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
    this.goals?.sort((goalA, goalB) => Number(goalA.completed) - Number(goalB.completed));
  }
}
