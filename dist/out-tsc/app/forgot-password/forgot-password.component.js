import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
let ForgotPasswordComponent = class ForgotPasswordComponent {
    constructor(formBuilder, http) {
        this.formBuilder = formBuilder;
        this.http = http;
        this.message = '';
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
    ngOnInit() {
        // Initialization logic if needed
    }
    onSubmit() {
        if (this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.get('email')?.value;
            this.resetPassword(email).subscribe(response => {
                this.message = 'Password reset link has been sent to your email.';
            }, error => {
                this.message = 'An error occurred while sending the password reset link.';
            });
        }
    }
    // Simulate a password reset API call
    resetPassword(email) {
        // Replace the URL with your actual password reset endpoint
        const url = 'https://your-backend-api/reset-password';
        return this.http.post(url, { email }).pipe(map(response => response), // Process response if needed
        catchError(error => {
            console.error('Password reset error:', error);
            return of(null); // Handle error
        }));
    }
};
ForgotPasswordComponent = __decorate([
    Component({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.component.html',
        styleUrls: ['./forgot-password.component.css']
    })
], ForgotPasswordComponent);
export { ForgotPasswordComponent };
//# sourceMappingURL=forgot-password.component.js.map