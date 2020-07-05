import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        let returnType;
        this.authService.getAuthToken()
            .subscribe(res => {
                if (!res) {
                    this.router.navigate(['/login']);
                    returnType = false;
                } else {
                    returnType = true;
                }
            }, error => {
                this.router.navigate(['/login']);
                returnType = false;
            });
        return returnType;
    }
}