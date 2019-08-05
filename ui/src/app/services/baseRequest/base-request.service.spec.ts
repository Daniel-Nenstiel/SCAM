import { TestBed } from '@angular/core/testing';

import { BaseRequestService } from './base-request.service';

describe('BaseRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseRequestService = TestBed.get(BaseRequestService);
    expect(service).toBeTruthy();
  });
});
