import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordViewComponent } from './patient-record-view.component';

describe('PatientRecordViewComponent', () => {
  let component: PatientRecordViewComponent;
  let fixture: ComponentFixture<PatientRecordViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientRecordViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientRecordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
