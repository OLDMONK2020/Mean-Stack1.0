import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent {
    credential: object = {};
    constructor(private authServive: AuthService) { }

    signup(form: NgForm) {
        this.authServive.createUser(form.value.email, form.value.password)
            .subscribe(res => {
                console.log(res);
            }, error => {
                console.log(error);
            });
    }
}
