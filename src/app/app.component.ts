import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const tokenLocalStorage = this.authService.getTokenLocalStorage();
    if (tokenLocalStorage) {
      const now = new Date();
      const timeAvailable = new Date(localStorage.getItem('expiresIn')).getTime() - now.getTime();
      if (timeAvailable) {
        this.authService.setAuthToken(true);
        this.authService.timeOut(timeAvailable / 1000);
      } else {
        this.authService.setAuthToken(false);
      }

    } else {
      this.authService.setAuthToken(false);
    }
  }
}
