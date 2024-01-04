import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsAllocationComponent } from './founds-allocation.component';

describe('FoundsAllocationComponent', () => {
  let component: FoundsAllocationComponent;
  let fixture: ComponentFixture<FoundsAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundsAllocationComponent]
    });
    fixture = TestBed.createComponent(FoundsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
