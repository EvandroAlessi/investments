import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsDistributionChartComponent } from './fund-distribution-chart.component';

describe('FoundsDistributionChartComponent', () => {
  let component: FoundsDistributionChartComponent;
  let fixture: ComponentFixture<FoundsDistributionChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundsDistributionChartComponent]
    });
    fixture = TestBed.createComponent(FoundsDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
