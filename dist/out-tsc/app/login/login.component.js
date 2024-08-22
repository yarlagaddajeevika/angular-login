import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let LoginComponent = class LoginComponent {
    constructor(formBuilder, imageLoader) {
        this.formBuilder = formBuilder;
        this.imageLoader = imageLoader;
        this.logoUrl = '';
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    ngOnInit() {
        this.loadLogo();
    }
    loadLogo() {
        const logoUrl = 'https://avatars.githubusercontent.com/u/124091983';
        this.imageLoader.loadImage(logoUrl).subscribe((blob) => {
            this.logoUrl = URL.createObjectURL(blob);
        });
    }
    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Login form submitted');
        }
        else {
            return;
        }
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map