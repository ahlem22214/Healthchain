// patient-doctor-access.service.ts

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class PatientDoctorAccessService {
  private apiUrl = 'http://localhost:3000'; // Replace with your backend API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService ){ }// Inject AuthService) { }

  // Fetch PatientDoctorAccess documents
  getPatientDoctorAccess(patientId: string): Observable<any[]> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any[]>(`${this.apiUrl}/patient/patientDoctorAccess/${patientId}`, requestOptions);
  }

  // Fetch doctor details by ID
  getDoctorDetails(doctorId: string): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiUrl}/doctor/doctorsemr/${doctorId}`, requestOptions);
  }


  revokeAccess(selectedAccount: string, doctorId: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError('Token not found');
    }

    const body = { selectedAccount, doctorId };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers,
      body: body
    };

    return this.http.delete<any>(`${this.apiUrl}/patient/revokeAccess/${doctorId}`, requestOptions);
  }


  getAccessiblePatients(doctorId: string): Observable<any[]> {
    const token = this.authService.getToken();
    console.log(token)
        if (!token) {
          return throwError('Token not found');
        }
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const requestOptions = {
          headers: headers
        };
        console.log(headers)

    return this.http.get<any[]>(`${this.apiUrl}/doctor/accessiblePatients/${doctorId}`, requestOptions)
      .pipe(
        catchError(error => {
          console.error('Error fetching accessible patients:', error);
          return throwError('Error fetching accessible patients');
        })
      );
  }
}


