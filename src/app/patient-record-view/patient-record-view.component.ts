import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientRecordsService } from '../patient-records.service';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service';

import { forkJoin } from 'rxjs';


interface DiagnosisCard {
  doctorName: string; // Change from doctorId to doctorName
  diagnosis: string;
  details: string;
  cardId:string;
  recordId:string;
}

@Component({
  selector: 'app-patient-record-view',
  templateUrl: './patient-record-view.component.html',
  styleUrls: ['./patient-record-view.component.css']
})
export class PatientRecordViewComponent implements OnInit {
  patientId: string = '';
  patientRecords: DiagnosisCard[] = [];
  card_id:string='';
  record_id:string='';

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,

    private route: ActivatedRoute,
    private patientRecordsService: PatientRecordsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
      this.loadPatientRecords();
    });
  }

  loadPatientRecords(): void {
    this.patientRecordsService.getPatientRecords(this.patientId).subscribe(
      (response: any) => {
        console.log(this.patientId);
  
        // Extract recordId and cards from the response
        const recordId = response.recordId;
        //record_Id:recordId;
        console.log(recordId);

        const cards = response.cards;
        console.log(cards);
  
        // Array to store observables of doctor info requests
        const doctorInfoRequests = [];
  
        // Iterate over each card to fetch doctor info
        for (const card of cards) {
          // Modify the method call to pass the doctorId directly
          console.log(card.doctorId);
        // cardId: card;
          doctorInfoRequests.push(this.doctorService.getDoctorInfos(card.doctorId));
        }
  
        // Combine all observables and execute them in parallel
        forkJoin(doctorInfoRequests).subscribe(
          (doctorInfos: any[]) => {
            // Use the resolved doctor info to create patient records
            this.patientRecords = cards.map((card: any, index: number) => {
              const doctorInfo = doctorInfos[index];

              return {
                doctorName: doctorInfo.name,
                diagnosis: card.diagnosis,
                details: card.details,
                cardId: card.cardId,
                recordId: recordId


              };
            });
          },
          (error) => {
            console.error('Error fetching doctor info:', error);
            // Handle error as needed
          }
        );
      },
      (error) => {
        console.error('Error fetching patient records:', error);
        // Handle error as needed
      }
    );
  }
  
  
  

  deleteDiagnosisCard(record_id: string, card_id: string): void {
    this.patientRecordsService.deleteDiagnosisCard(record_id, card_id).subscribe(
      () => {
        // Handle deletion success
        console.log('Diagnosis card deleted successfully');
        
        // Assuming you want to refresh patient records after deletion
        this.loadPatientRecords();
      },
      (error) => {
        console.error('Error deleting diagnosis card:', error);
        
        // Handle error
        // For example, display an error message to the user
      }
    );
  }

}  

