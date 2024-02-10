import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldBuilderComponent } from './form-field-builder.component';

describe('FormFieldBuilderComponent', () => {
  let component: FormFieldBuilderComponent;
  let fixture: ComponentFixture<FormFieldBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldBuilderComponent]
    });
    fixture = TestBed.createComponent(FormFieldBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
