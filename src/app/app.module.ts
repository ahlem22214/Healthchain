import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginPatientComponent } from './login-patient/login-patient.component';
import { SignupPatientComponent } from './signup-patient/signup-patient.component';
import { SignupDoctorComponent } from './signup-doctor/signup-doctor.component';
import { LoginComponent } from './login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DoctorInterfaceComponent } from './doctor-interface/doctor-interface.component';
import { PatientRecordsComponent } from './patient-records/patient-records.component';
import { DiagnosisCardComponent } from './diagnosis-card/diagnosis-card.component';
import { AuthService } from './auth.service';
import { DoctorService } from './doctor.service';
import { PatientRecordViewComponent } from './patient-record-view/patient-record-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginPatientComponent,
    SignupPatientComponent,
    SignupDoctorComponent,
    LoginComponent,
    DoctorInterfaceComponent,
    PatientRecordsComponent,
    DiagnosisCardComponent,
    PatientRecordViewComponent,
    DashboardComponent,
    PatientDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]) ,  
      MatSnackBarModule
    // Add RouterModule.forRoot here


  ],
  providers: [
    provideClientHydration(),
    AuthService,
    DoctorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }