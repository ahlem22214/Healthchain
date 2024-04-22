import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisCardComponent } from './diagnosis-card.component';

describe('DiagnosisCardComponent', () => {
  let component: DiagnosisCardComponent;
  let fixture: ComponentFixture<DiagnosisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosisCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
