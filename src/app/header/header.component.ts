import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
    isAuthenticated: boolean = false;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.getAuthToken()
            .subscribe(res => {
                if (res) {
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
            }, error => {
                this.isAuthenticated = false;
            });
    }

    signout() {
        this.authService.logout();
    }
}