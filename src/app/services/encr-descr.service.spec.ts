import { TestBed } from '@angular/core/testing';

import { EncrDescrService } from './encr-descr.service';

describe('EncrDescrService', () => {
  let service: EncrDescrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncrDescrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
