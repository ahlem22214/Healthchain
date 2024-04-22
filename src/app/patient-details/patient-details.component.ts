import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patientId: string= '';
  patient: any; // Define patient object

  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    // Retrieve patient ID from route parameters
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
      // Fetch patient details using patientId
      this.patientService.getPatientDetails(this.patientId).subscribe(
        (data) => {
          this.patient = data; // Assign fetched patient details to patient object
        },
        (error) => {
          console.error('Error fetching patient details:', error);
          // Handle error
        }
      );
    });
  }
}
