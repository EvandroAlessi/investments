import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDistributionComponent } from './fund-distribution.component';

describe('FoundsAllocationComponent', () => {
  let component: FundDistributionComponent;
  let fixture: ComponentFixture<FundDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundDistributionComponent]
    });
    fixture = TestBed.createComponent(FundDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
