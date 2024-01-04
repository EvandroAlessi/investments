import { TestBed } from '@angular/core/testing';

import { SynchronyService } from './synchrony.service';

describe('SynchronyService', () => {
  let service: SynchronyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynchronyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
