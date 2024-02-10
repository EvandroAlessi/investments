import { DistributedBy as DistributedBy } from "../enums/distributed-by.enum";

export interface InvestmentDistribution {
    id?: number;
    fixedIncome: number;
    realState: number;
    stockExchange: number;
    crypto: number;
    internacional: number;
    distributedBy: number
}