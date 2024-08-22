import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.resetPassword(email).subscribe(
        response => {
          this.message = 'Password reset link has been sent to your email.';
        },
        error => {
          this.message = 'An error occurred while sending the password reset link.';
        }
      );
    }
  }

  // Simulate a password reset API call
  resetPassword(email: string): Observable<any> {
    // Replace the URL with your actual password reset endpoint
    const url = 'https://your-backend-api/reset-password'; 
    return this.http.post(url, { email }).pipe(
      map(response => response), // Process response if needed
      catchError(error => {
        console.error('Password reset error:', error);
        return of(null); // Handle error
      })
    );
  }
}
