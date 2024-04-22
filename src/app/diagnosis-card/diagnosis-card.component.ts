import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-diagnosis-card',
  templateUrl: './diagnosis-card.component.html',
  styleUrls: ['./diagnosis-card.component.css']
})
export class DiagnosisCardComponent {
  @Input() record: any; // Input property to receive record data from parent component
}
