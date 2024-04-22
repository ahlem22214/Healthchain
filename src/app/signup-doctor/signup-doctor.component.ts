import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService
import { MetaMaskService } from '../metamask.service'; // Import MetaMaskService

// Interface definition for API response
interface User {
  name: string;
  password: string;
  age: string;
  gender: string;
  email: string;
  role: string;
  specialization: string;
  selectedAccount?: string; // Include selectedAccount property
}


@Component({
  selector: 'app-signup-doctor',
  templateUrl: './signup-doctor.component.html',
  styleUrls: ['./signup-doctor.component.css']
})
export class SignupDoctorComponent {

  user: User = {
    name: '',
    password: '',
    age: '',
    gender: '',
    email: '',
    role: 'Doctor',
    specialization: ''
  };
  
  roles = ['Patient', 'Doctor'];
  genders = ['male', 'female'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private metaMaskService: MetaMaskService // Inject MetaMaskService
  ) { }

  signupMessage: string = '';
  signupStatus: string = '';

  async submitForm() {
    console.log('User:', this.user);
    try {
      // Connect to MetaMask
      const connected = await this.metaMaskService.connect();
      if (!connected) {
        console.error('Failed to connect to MetaMask.');
        return;
      }
  
      // Get the selected MetaMask account
      const selectedAccount = await this.metaMaskService.getSelectedAccount();
      if (!selectedAccount) {
        console.error('No account selected in MetaMask.');
        return;
      }
  
      // Include selected account in the user object
      this.user.selectedAccount = selectedAccount;
  
      this.http.post<any>('http://127.0.0.1:3000/user/signup-doctor', this.user)
        .subscribe(response => {
          console.log('response:', response);
          this.signupMessage = response.message;
          this.signupStatus = response.status;
  
          if (response.status === 'SUCCESS' && response.data && response.data.token) {
            // Store the token using AuthService
            this.authService.storeToken(response.data.token).subscribe(() => {
              console.log('Token stored successfully');
            }, error => {
              console.error('Error storing token:', error);
            });
  
            // Redirect to doctor interface after signup
            this.router.navigate(['/doctor-interface']);
          }
        }, error => {
          console.error('error:', error);
        });
    } catch (error) {
      console.error('Error fetching selected account:', error);
    }
  }}  