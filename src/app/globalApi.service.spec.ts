import { TestBed } from '@angular/core/testing';

import { GlobalApiService } from './globalApi.service';

describe('GlobalApiService', () => {
  let service: GlobalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
