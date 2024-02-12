import { DistributedBy } from "../enums/distributed-by.enum";

export interface Investment {
    id?: number;
    fixedIncome: number;
    realState: number;
    stockExchange: number;
    crypto: number;
    internacional: number;
    distributedBy: DistributedBy;
    isProjection: boolean;
}