import { TestBed } from '@angular/core/testing';

import { PatientDoctorAccessService } from './patient-doctor-access.service';

describe('PatientDoctorAccessService', () => {
  let service: PatientDoctorAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientDoctorAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
