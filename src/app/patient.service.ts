import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // Import AuthService
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PatientService {
  private apiUrl = 'http://127.0.0.1:3000/patient'; // Replace this with your actual backend API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  getPatientInfo(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
console.log(token)
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    return this.http.get<any>(`${this.apiUrl}/patientinfo`, requestOptions);
  }


getPatientInfos(patientId: string): Observable<any> {
  const token = this.authService.getToken(); // Retrieve token from AuthService
  console.log(token);
  if (!token) {
    // Handle the case where token is missing
    return throwError('Token not found');
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const requestOptions = {
    headers: headers
  };

  return this.http.get<any>(`${this.apiUrl}/patientinfos/${patientId}`, requestOptions);
}


  
  grantAccess(requestBody: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    return this.http.post<any>(`${this.apiUrl}/grant-access`, requestBody, requestOptions);
  }

  getAllPatients(): Observable<any[]> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
  
    return this.http.get<any[]>(`${this.apiUrl}/patients`, requestOptions);
  }
  
  
  //delete patient admin
  deletePatient(patientId: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    const url = `${this.apiUrl}/deletepatient/${patientId}`;
    return this.http.delete<any>(url, requestOptions);
  }
  
  //patient detailadmin
  getPatientDetails(patientId: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiUrl}/patients/${patientId}`,requestOptions);
  } 

  updatePatient(patientId: string, updatedPatientData: any): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    const url = `${this.apiUrl}/api/patients/${patientId}`;
    return this.http.put<any>(url, updatedPatientData, requestOptions);
  }

}


