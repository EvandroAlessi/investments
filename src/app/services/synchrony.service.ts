import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SynchronyService {
  updateChartSubject = new Subject<boolean>();

  constructor() { }

  updateChartChannel(): Observable<boolean> {
    return this.updateChartSubject.asObservable();
  }

  updateChart(): void {
    this.updateChartSubject.next(true);
  }
}
