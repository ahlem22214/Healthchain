import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginPatientComponent } from './login-patient/login-patient.component';
import { SignupPatientComponent } from './signup-patient/signup-patient.component';
import { SignupDoctorComponent } from './signup-doctor/signup-doctor.component';
import { LoginComponent } from './login/login.component';
import { DoctorInterfaceComponent } from './doctor-interface/doctor-interface.component';
import { PatientRecordsComponent } from './patient-records/patient-records.component';
import { PatientRecordViewComponent } from './patient-record-view/patient-record-view.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';






const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Route par défaut
    {path: 'login' , component: LoginComponent },
    {path: 'signup-doctor' , component: SignupDoctorComponent },
    {path: 'signup-patient' , component: SignupPatientComponent },
    {path: 'login-patient' , component: LoginPatientComponent },
    {path: 'navbar' , component: NavbarComponent },
    {path: 'doctor-interface' , component: DoctorInterfaceComponent },
    { path: 'patient-records/:id', component: PatientRecordsComponent }, 
    { path: 'patient-record-view/:id', component: PatientRecordViewComponent }, // Define the route with parameter
    { path: 'patient/:id', component: PatientDetailsComponent },
    { path: 'dashboard', component: DashboardComponent },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
