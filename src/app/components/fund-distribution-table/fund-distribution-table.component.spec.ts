import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsDistributionComponent } from './fund-distribution-table.component';

describe('FoundsDistributionComponent', () => {
  let component: FoundsDistributionComponent;
  let fixture: ComponentFixture<FoundsDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundsDistributionComponent]
    });
    fixture = TestBed.createComponent(FoundsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
