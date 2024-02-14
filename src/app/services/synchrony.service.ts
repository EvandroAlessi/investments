import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SynchronyService {
  loadingContentSubject = new Subject<boolean>();

  investmentChartSubject = new Subject<boolean>();
  investmentTableSubject = new Subject<boolean>();

  constructor() { }

  investmentChartUpdated(): Observable<boolean> {
    return this.investmentChartSubject.asObservable();
  }

  updateInvestmentChart(): void {
    this.investmentChartSubject.next(true);
  }

  investmentTableUpdated(): Observable<boolean> {
    return this.investmentTableSubject.asObservable();
  }

  updateInvestmentTable(): void {
    this.investmentTableSubject.next(true);
  }

  isLoadingContent(): Observable<boolean> {
    return this.loadingContentSubject.asObservable();
  }

  setIsLoadingContent(isLoading: boolean): void {
    this.loadingContentSubject.next(isLoading);
  }
}
