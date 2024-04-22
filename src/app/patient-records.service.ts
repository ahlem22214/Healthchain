import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // Import AuthService
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientRecordsService {
  private baseUrl = 'http://localhost:3000/record'; // Adjust the base URL as per your backend API

  constructor(  private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }
  getPatientRecords(patientId: string): Observable<any[]> {

    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    const url = `${this.baseUrl}/patient-records/${patientId}`;
    return this.http.get<any[]>(url, requestOptions);
  }

  addDiagnosisRecord(patientId: string, record: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    const url = `${this.baseUrl}/patient-records/${patientId}/add-record`;
    return this.http.post<any>(url, record, requestOptions);
  }
  deleteDiagnosisCard(recordId: string, cardId: string): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    return this.http.delete(`${this.baseUrl}/diagnosisRecords/${recordId}/cards/${cardId}`,requestOptions);
  }
}
