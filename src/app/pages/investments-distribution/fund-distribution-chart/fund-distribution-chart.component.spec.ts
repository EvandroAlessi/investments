import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsDistributionChartComponent } from './fund-distribution-chart.component';

describe('FoundsDistributionChartComponent', () => {
  let component: FundsDistributionChartComponent;
  let fixture: ComponentFixture<FundsDistributionChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundsDistributionChartComponent]
    });
    fixture = TestBed.createComponent(FundsDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
