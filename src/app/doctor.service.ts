import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // Import AuthService
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://127.0.0.1:3000/doctor'; // Replace this with your actual backend API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  // Method to get doctor's information
  getDoctorInfo(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    return this.http.get<any>(`${this.apiUrl}/doctorinfo`, requestOptions);
  }

  getDoctorInfos(doctorId: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    return this.http.get<any>(`${this.apiUrl}/doctorinfos/${doctorId}`, requestOptions);
  }



  // Method to get all doctors' names
  getAllDoctors(): Observable<any[]> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };

    return this.http.get<any[]>(`${this.apiUrl}/doctors`, requestOptions);
  }

  deleteDoctor(doctorId: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    const url = `${this.apiUrl}/deletedoctor/${doctorId}`;
    return this.http.delete<any>(url, requestOptions);
  }

  updateDoctor(doctorId: string, updatedDoctorData: any): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers
    };
    const url = `${this.apiUrl}/api/doctors/${doctorId}`;
    return this.http.put<any>(url, updatedDoctorData, requestOptions);
  }
}


