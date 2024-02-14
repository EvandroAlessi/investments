import { Injectable } from '@angular/core';
import { INDEXED_DB } from '../database/indexed-db';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor() { }

  async createGoal(goal: Goal): Promise<Goal> {
    goal.id = await INDEXED_DB.goals.add(goal);

    return goal;
  }

  async createEmptyGoal(): Promise<Goal> {
    const goal: Goal = <Goal>{
      completed: false,
      currentAmount: 0,
      totalCost: 0,
      startDate: new Date(),
      deadLine: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    };

    goal.id = await INDEXED_DB.goals.add(goal);

    return goal;
  }

  async getGoal(id: number): Promise<Goal> {
    return await INDEXED_DB.goals.get({ id: id })
      ?? <Goal>{};
  }

  async getAllGoals(): Promise<Goal[]> {
    return await INDEXED_DB.goals.toArray()
      ?? <Goal[]>{};
  }

  async updateGoal(goal: Goal, id: number): Promise<void> {
    await INDEXED_DB.goals.update(id, goal);
  }
}
