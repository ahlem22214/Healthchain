import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorInterfaceComponent } from './doctor-interface.component';

describe('DoctorInterfaceComponent', () => {
  let component: DoctorInterfaceComponent;
  let fixture: ComponentFixture<DoctorInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
