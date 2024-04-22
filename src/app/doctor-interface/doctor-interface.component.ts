import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service'; // Adjust the path as per your project structure
import { PatientDoctorAccessService } from '../patient-doctor-access.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-doctor-interface',
  templateUrl: './doctor-interface.component.html',
  styleUrls: ['./doctor-interface.component.css']
})
export class DoctorInterfaceComponent implements OnInit {
  doctor: any;
  age: string = '';
  name: string = '';
  specialization: string = '';
  doctorId: string=""; // Assuming doctorId is obtained from somewhere
  patients: any[] = [];

  constructor(
    private doctorService: DoctorService,
    private patientDoctorAccessService: PatientDoctorAccessService,
    private router: Router

    ) { }

  ngOnInit(): void {
    this.getDoctorInfo();
   // this.getAccessiblePatients();

  }

  getDoctorInfo(): void {
    this.doctorService.getDoctorInfo().subscribe(
      (response) => {
        this.doctor = response;
        // Assign values to the variables
        this.age = this.doctor.age;
        this.name = this.doctor.name;
        this.specialization = this.doctor.specialization;
        this.doctorId = this.doctor.doctorId; 
        console.log(this.doctorId);
        this.getAccessiblePatients(this.doctorId).subscribe((patients) => {
          // Handle patients if needed
        });
      },
      (error) => {
        console.error('Error fetching doctor info:', error);
        // Handle error as per your application's requirements
      }
    );
  }
  
  getAccessiblePatients(doctorId: string): Observable<any[]> {
    if (!doctorId) {
      // If doctorId is not available, return an empty array
      console.error('Doctor ID not available');
      return of([]);
    }
  
    return this.patientDoctorAccessService.getAccessiblePatients(doctorId).pipe(
      tap((patients: any[]) => {
        // Clear existing data in patients array
        this.patients = [];
        // Push each patient's id and name to the patients array
        patients.forEach(patient => {
          this.patients.push({
            id: patient._id,
            name: patient.name
          });
          console.log(this.patients)
          console.log(typeof(this.patients));

        });
      }),
      catchError((error) => {
        console.error('Error fetching accessible patients:', error);
        // Handle error as needed
        console.log(typeof(this.patients));
        return of(this.patients);
      })
    );
  }

  viewPatientRecords(patientId: string): void {
    // Navigate to patient-records component with patient ID
    this.router.navigate(['/patient-records', patientId]);
    console.log(patientId);

  }
}
