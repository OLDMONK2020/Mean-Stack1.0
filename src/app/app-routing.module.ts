import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListPostComponent } from './posts/list-post/list-post.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/listposts', pathMatch: 'full' },
    { path: 'listposts', component: ListPostComponent },
    { path: 'createposts', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'editposts/:postid', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}