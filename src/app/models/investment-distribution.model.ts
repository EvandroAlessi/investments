import { DistributedBy as DistributedBy } from "../enums/distributed-by.enum";

export interface InvestmentDistribution {
    fixedIncome: number;
    realState: number;
    stockExchange: number;
    crypto: number;
    internacional: number;
    distributedBy: DistributedBy
}