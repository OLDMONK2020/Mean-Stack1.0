import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, delay, map, publishReplay, refCount } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class PostsService {
    private listPost = new BehaviorSubject(null);
    paginationPageSize = 3;
    paginationCurrentPage = 1;

    constructor(private http: HttpClient, private router: Router) { }

    getListPost(): Observable<any> {
        return this.listPost.asObservable();
    }
    setListPost(post: object, maxCount: any) {
        post['maxCount'] = maxCount;
        this.listPost.next(post);
    }
    postPost(post) {
        const payLoad = new FormData();
        payLoad.append('title', post.title);
        payLoad.append('content', post.content);
        if (post.image) {
            payLoad.append('image', post.image, post.title);
        }

        return this.http.post('http://localhost:3000/api/post', payLoad)
            .subscribe(res => {
                if (res && res['status'] === 'success') {
                    this.router.navigate(['/']);
                }
            }, error => { this.handleError(error); });
    }
    getPosts(queryPageSize, queryCurrentPage) {
        const queryParam = `?pageSize=${queryPageSize}&currentPage=${queryCurrentPage}`;
        return this.http.get('http://localhost:3000/api/posts' + queryParam)
            .subscribe(res => {
                if (res && res['status'] === 'success') {
                    this.setListPost(res['data'], res['maxCount']);
                }
            }, error => { this.handleError(error); });
    }
    deletePost(id: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + id)
            .subscribe(res => {
                if (res && res['status'] === 'success') {
                    this.getPosts(this.paginationPageSize, 1);
                }
            });
    }
    editPost(post: any, id: string) {
        const payLoad = new FormData();
        payLoad.append('id', post.id);
        payLoad.append('title', post.title);
        payLoad.append('content', post.content);
        payLoad.append('imagePath', post.imagePath);
        if (post.image) {
            payLoad.append('image', post.image, post.title);
        }

        return this.http.put('http://localhost:3000/api/posts/' + id, payLoad)
            .subscribe(res => {
                if (res && res['status'] === 'success') {
                    this.router.navigate(['/']);
                }
            });
    }
    getSinglePost(id: string) {
        return this.http.get('http://localhost:3000/api/posts/' + id);
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}
