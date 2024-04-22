import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService
import { MetaMaskService } from '../metamask.service'; // Import MetaMaskService

// Define an interface for the user object
interface User {
  name: string;
  password: string;
  age: string;
  gender: string;
  email: string;
  role: string;
  cnss: string;
  selectedAccount?: string; // Optional property for selected MetaMask account
}

@Component({
  selector: 'app-signup-patient',
  templateUrl: './signup-patient.component.html',
  styleUrls: ['./signup-patient.component.css']
})
export class SignupPatientComponent {
  // Initialize user object with User interface
  user: User = {
    name: '',
    password: '',
    age: '',
    gender: '',
    email: '',
    role: 'Patient', // Set role to 'Patient' for patient signup
    cnss: ''
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
    // Connect to MetaMask
    const connected = await this.metaMaskService.connect();
    if (connected) {
      // Retrieve the selected account
      const selectedAccount = await this.metaMaskService.getSelectedAccount();
      if (selectedAccount) {
        // Assign the selected account address to user object
        this.user.selectedAccount = selectedAccount;

        // Submit the signup data to the backend API
        this.http.post<any>('http://127.0.0.1:3000/user/signup-patient', this.user)
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

              // Redirect to login page after signup
              this.router.navigate(['/login-patient']);
            }
          }, error => {
            console.error('error:', error);
          });
      } else {
        console.error('No account selected in MetaMask.');
      }
    } else {
      console.error('Failed to connect to MetaMask.');
    }
  }
}
