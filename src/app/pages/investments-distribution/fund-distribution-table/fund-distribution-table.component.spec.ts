import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsDistributionTableComponent } from './fund-distribution-table.component';

describe('FoundsDistributionComponent', () => {
  let component: FundsDistributionTableComponent;
  let fixture: ComponentFixture<FundsDistributionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundsDistributionTableComponent]
    });
    fixture = TestBed.createComponent(FundsDistributionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
