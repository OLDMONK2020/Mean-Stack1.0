import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    credential: object = {};

    constructor(private authService: AuthService, private router: Router) { }

    login(form: NgForm) {
        this.authService.login(form.value.email, form.value.password)
            .subscribe(res => {
                if (res && res['token']) {
                    this.authService.timeOut(res['expiresIn']);
                    this.authService.setTokenLocalStorage(res);
                    this.authService.setAuthToken(true);
                    this.router.navigate(['/']);
                }
            }, error => {
                console.log(error);
                this.authService.setAuthToken(false);
            });
    }
}
