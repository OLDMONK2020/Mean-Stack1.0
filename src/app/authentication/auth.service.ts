import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    tokenTimer: any;
    private hasAuthToken = new BehaviorSubject(null);
    constructor(private http: HttpClient, private router: Router) { }

    setAuthToken(data) {
        this.hasAuthToken.next(data);
    }
    getAuthToken() {
        return this.hasAuthToken.asObservable();
    }
    getCurrentUserId() {
        return localStorage.getItem('createdBy');
    }

    createUser(emailid: string, pass: string) {
        const payLoad = {
            email: emailid,
            password: pass
        }
        return this.http.post('http://localhost:3000/api/users/signup', payLoad);
    }

    login(emailid: string, pass: string) {
        const payLoad = {
            email: emailid,
            password: pass
        }
        return this.http.post('http://localhost:3000/api/users/login', payLoad);
    }

    logout() {
        this.setAuthToken(false);
        this.removeTokenLocalStorage();
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
    }

    setTokenLocalStorage(data: object) {
        let now = new Date();
        let expiresIn = new Date(now.getTime() + (data['expiresIn'] * 1000));
        localStorage.setItem('token', data['token']);
        localStorage.setItem('expiresIn', expiresIn.toISOString());
        localStorage.setItem('createdBy', data['createdBy']);
    }

    getTokenLocalStorage() {
        const localToken = localStorage.getItem('token');
        const localExpiresTime = localStorage.getItem('expiresIn');
        if (localToken && localExpiresTime) {
            return {
                token: localToken,
                expiresIn: localExpiresTime
            }
        } else {
            return false;
        }
    }

    removeTokenLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('createdBy');
    }

    timeOut(expires) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, expires * 1000);
    }
}