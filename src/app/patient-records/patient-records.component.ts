import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientRecordsService } from '../patient-records.service';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service';
import { MetaMaskService } from '../metamask.service'; // Import MetaMaskService
import { Buffer } from 'buffer'; // Import Buffer module if you haven't already

let bufferfile: Buffer | null = null; // Declare buffer variable globally

interface PatientRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
  bufferfile: any; // Add pdfData property
}

interface DiagnosisRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
  bufferfile: any; // Add pdfData property

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
  errorMessage: string = ''; // Declare errorMessage property here
  accountVerificationError: string = '';
  selectedFile: File | null = null; // Add selectedFile property
  

  constructor(
    private route: ActivatedRoute,
    private patientRecordsService: PatientRecordsService,
    private doctorService: DoctorService,
    private patientService: PatientService, // Inject PatientService
    private metaMaskService: MetaMaskService
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
            console.log(record.details),
            console.log(record.bufferfile)


            return {
              doctorId: record.doctorId,
              diagnosis: record.diagnosis,
              details: record.details,
bufferfile:record.bufferfile,            };
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

onFileSelected(event: any): void {
  const selectedFile: File = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const fileContent = reader.result as ArrayBuffer;
    bufferfile = Buffer.from(fileContent); // Convert ArrayBuffer to Buffer
    console.log('File buffer:', bufferfile);
    // Now you have the binary data of the selected file in the buffer variable
    // You can use this buffer as needed, such as sending it to the backend
  };

  // Read the file as an ArrayBuffer
  reader.readAsArrayBuffer(selectedFile);
}

// Add a function to handle displaying the PDF
// Add a function to handle displaying the PDF
// Add a function to handle displaying the PDF
onDisplayFile(bufferfile: any): void {
  console.log(bufferfile);
  if (bufferfile && bufferfile.type === 'Buffer' && Array.isArray(bufferfile.data)) {
    // Convert the buffer data to a Buffer object
    const bufferData = Buffer.from(bufferfile.data);
    // Convert the Buffer object to a Base64 string
    const base64Data = bufferData.toString('base64');
    
    // Open the PDF in a new tab
    const pdfUrl = 'data:application/pdf;base64,' + base64Data;
    window.open(pdfUrl, '_blank');
  } else {
    console.error('PDF data is missing or invalid');
  }
}



  addRecord(): void {
    this.metaMaskService.connect().then((connected) => {
      if (!connected) {
        console.error('Failed to connect to MetaMask.');
        return;
      }
  
      this.metaMaskService.getSelectedAccount().then((accountAddress) => {
        if (!accountAddress) {
          console.error('No account selected in MetaMask.');
          return;
        }
        console.log(typeof this.selectedFile); // Output: number
  
        this.doctorService.getDoctorInfo().subscribe(
          (doctorInfo) => {
            const doctorId = doctorInfo.doctorId;
            const { diagnosis, details } = this.newRecord;

            
           

            this.patientRecordsService.addDiagnosisRecord(this.patientId, doctorId, diagnosis, details, accountAddress, bufferfile).subscribe(
              (response: any) => {
                this.newRecord = { doctorId: '', diagnosis: '', details: '' };
                this.loadPatientRecords();
                
              },
              (error) => {
                console.error('Error adding diagnosis record:', error);
                this.accountVerificationError = 'Account verification failed. Make sure you are using the correct account.';
                setTimeout(() => {
                  this.accountVerificationError = '';
                }, 5000); // Clear error after 5 seconds (5000 milliseconds)
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
