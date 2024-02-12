import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsDistributionComponent } from './investments-distribution.component';

describe('FoundsStepperComponent', () => {
  let component: InvestmentsDistributionComponent;
  let fixture: ComponentFixture<InvestmentsDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentsDistributionComponent]
    });
    fixture = TestBed.createComponent(InvestmentsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
