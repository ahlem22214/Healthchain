import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  patient: any = { name: '', age: '' };
  age: string = '';
  name: string = '';
  id: string = '';
  doctors: any[] = [];
  patients: any[] = [];
  patientId: string = '';
  editMode: boolean = false;
  editedUser: any = {};

  constructor(private patientService: PatientService, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.getAllPatients();
    this.getAllDoctors();
  }

  getAllPatients(): void {
    this.patientService.getAllPatients().subscribe(
      (response) => {
        this.patients = response;
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  getAllDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(
      (response) => {
        this.doctors = response;
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  deleteDoctor(doctor: any): void {

    // Envoyer une demande de suppression au service du médecin
    this.doctorService.deleteDoctor(doctor._id).subscribe(
      () => {
        // Si la suppression réussit, supprimer le médecin du tableau
        this.doctors = this.doctors.filter(d => d._id !== doctor._id);
      },
      (error) => {
        console.error('Error deleting doctor:', error);
      }
    );

    console.log('Deleting doctor:', doctor);
  }

  deletePatient(patient: any): void {
    // Envoyer une demande de suppression au service du patient
    this.patientService.deletePatient(patient._id).subscribe(
      () => {
        // Si la suppression réussit, supprimer le patient du tableau
        this.patients = this.patients.filter(p => p._id !== patient._id);
      },
      (error) => {
        console.error('Error deleting patient:', error);
      }
    );
  }
  editPatient(patient: any): void {
    this.editedUser = { ...patient }; // Copy the patient object to avoid modifying the original data
    this.editMode = true;
  }

  editDoctor(doctor: any): void {
    this.editedUser = { ...doctor }; // Copy the doctor object to avoid modifying the original data
    this.editMode = true;
  }
  updateUser(): void {
    const userId = this.editedUser._id;
    const updatedUserData = this.editedUser;

    if (updatedUserData.role === 'Patient') {
      // Utiliser le service PatientService pour mettre à jour les détails du patient
      this.patientService.updatePatient(userId, updatedUserData).subscribe(
        (response) => {
          console.log('Patient updated successfully:', response);
          // Gérer la réponse du serveur si nécessaire
          this.editMode = false; // Cacher le formulaire d'édition après la mise à jour
        },
        (error) => {
          console.error('Error updating patient:', error);
          // Gérer les erreurs si nécessaire
        }
      );
    } else if (updatedUserData.role === 'Doctor') {
      // Utiliser le service DoctorService pour mettre à jour les détails du médecin
      this.doctorService.updateDoctor(userId, updatedUserData).subscribe(
        (response) => {
          console.log('Doctor updated successfully:', response);
          // Gérer la réponse du serveur si nécessaire
          this.editMode = false; // Cacher le formulaire d'édition après la mise à jour
        },
        (error) => {
          console.error('Error updating doctor:', error);
          // Gérer les erreurs si nécessaire
        }
      );
    } else {
      console.error('Unknown role:', updatedUserData.role);
    }
  }

}
