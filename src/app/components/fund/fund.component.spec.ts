import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsComponent } from './fund.component';

describe('FoundsComponent', () => {
  let component: FoundsComponent;
  let fixture: ComponentFixture<FoundsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundsComponent]
    });
    fixture = TestBed.createComponent(FoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
