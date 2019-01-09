import { TestBed, inject } from '@angular/core/testing';

import { OneDBService } from './one-db.service';

describe('OneDBService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OneDBService]
    });
  });

  it('should be created', inject([OneDBService], (service: OneDBService) => {
    expect(service).toBeTruthy();
  }));
});
