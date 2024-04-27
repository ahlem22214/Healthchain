import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService
import { MetaMaskService } from '../metamask.service'; // Import MetaMaskService

// Interface definition for User object
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountAddress?: string; // Include selectedAccount property

}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
    accountAddress: '' // Include selectedAccount property
  };
  loginMessage: string = '';
  loginStatus: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private metaMaskService: MetaMaskService // Inject MetaMaskService
  ) { }

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
      const accountAddress = await this.metaMaskService.getSelectedAccount();
      if (!accountAddress) {
        console.error('No account selected in MetaMask.');
        return;
      }

      // Include selected account in the user object
      this.user.accountAddress = accountAddress;

      this.http.post<any>('http://localhost:3000/user/login', this.user)
        .subscribe(response => {
          console.log('response:', response);
          this.loginMessage = response.message;
          this.loginStatus = response.status;

          if (response.status === 'SUCCESS' && response.data && response.data.token) {
            // Store the token using AuthService
            this.authService.storeToken(response.data.token).subscribe(() => {
              console.log('Token stored successfully');
            }, error => {
              console.error('Error storing token:', error);
            });

            // Redirect based on user role
            const role = response.data.user.role;
            console.log(role);
            switch (role) {
              case 'Patient':
                this.router.navigate(['/login-patient']); // Redirect to patient home page
                break;
              case 'Doctor':
                this.router.navigate(['/doctor-interface']); // Redirect to doctor home page
                break;
                case 'admin':
                this.router.navigate(['/dashboard']); // Redirect to doctor home page
                break;
              default:
                // Handle other roles or redirect to a default page
                break;
            }
          }
        }, error => {
          console.error('error:', error);
          this.loginMessage = error.error.message;
        });
    } catch (error) {
      console.error('Error fetching selected account:', error);
    }
  }
}
