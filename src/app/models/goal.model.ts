export interface Goal {
    id?: number;
    name: string;
    completed: boolean;
    description?: string;
    totalCost: number;
    currentAmount: number;
    startDate: Date;
    deadLine: Date;
}