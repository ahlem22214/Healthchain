import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { PatientRecordsService } from '../patient-records.service';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service';
import { MetaMaskService } from '../metamask.service'; // Import MetaMaskService




// Define an interface for the structure of PatientRecord
interface PatientRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
}

interface DiagnosisRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
} 

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit {
  patientId: string = '';
  patientRecords: PatientRecord[] = [];
  newRecord: any = { diagnosis: '', details: '' };
  patientName: string = '';
  gender: string = '';
  age: number = 0;


  constructor(
    private route: ActivatedRoute,
    private patientRecordsService: PatientRecordsService,
    private doctorService: DoctorService,
    private patientService: PatientService ,// Inject PatientService
    private metaMaskService: MetaMaskService,


  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
      this.getPatientInfo(); // Fetch patient info for the specific patient ID

      this.loadPatientRecords();

    });
  }

  loadPatientRecords(): void {
    this.patientRecordsService.getPatientRecords(this.patientId).subscribe(
      (response: any) => {
        // Check if 'cards' property exists in the response
        if (response.cards) {
          // Use 'response.cards' directly for mapping
          this.patientRecords = response.cards.map((record: DiagnosisRecord) => {
            return {
              doctorId: record.doctorId,
              diagnosis: record.diagnosis,
              details: record.details
            };
          });
        } else {
          // Handle case when 'cards' property is not present in the response
          console.error('No records found in the response');
          this.patientRecords = []; // Reset patientRecords array
        }
      },
      (error) => {
        console.error('Error fetching patient records:', error);
        // Handle error as needed
      }
    );
  }
  


  
  

  getPatientInfo(): void {
    this.patientService.getPatientInfos(this.patientId).subscribe(
    //  console.log(this.patientId)
      (response) => {
        // Extract patient's name and age from the response
        this.patientName = response.name,
        this.age = response.age,
        this.gender = response.gender,
        console.log(this.patientName);
      },
      (error) => {
        console.error('Error fetching patient info:', error);
        // Handle error as needed
      }
    );
  }

  // Add other methods as needed


  addRecord(): void {
    this.metaMaskService.connect().then((connected) => {
      if (!connected) {
        console.error('Failed to connect to MetaMask.');
        return;
      }
  
      this.metaMaskService.getSelectedAccount().then((selectedAccount) => {
        if (!selectedAccount) {
          console.error('No account selected in MetaMask.');
          return;
        }
  
        this.doctorService.getDoctorInfo().subscribe(
          (doctorInfo) => {
            const doctorId = doctorInfo.doctorId;
            const { diagnosis, details } = this.newRecord;
  
            this.patientRecordsService.addDiagnosisRecord(this.patientId, { doctorId, diagnosis, details,selectedAccount }).subscribe(
              () => {
                this.newRecord = { doctorId: '', diagnosis: '', details: '' };
                this.loadPatientRecords();
              },
              (error) => {
                console.error('Error adding diagnosis record:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching doctor info:', error);
          }
        );
      }).catch((error) => {
        console.error('Error fetching selected account:', error);
      });
    }).catch((error) => {
      console.error('Error connecting to MetaMask:', error);
    });
  }
  
  
}  
