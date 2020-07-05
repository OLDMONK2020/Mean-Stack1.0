import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
    selector: 'app-list-post',
    templateUrl: './list-post.component.html',
    styleUrls: ['./list-post.component.css']
})

export class ListPostComponent implements OnInit, OnDestroy {
    postsSubDestroy: any;
    currentUserId: any;
    isAuthenticated: boolean = false;
    postLists: Array<object> = [];
    pageLength: number = 0;
    pageSize: number;
    currentPage: number;
    pageSizeOptions: Array<number> = [1, 3, 5];

    constructor(private postsService: PostsService,
        private authService: AuthService) { }

    ngOnInit() {
        this.currentUserId = this.authService.getCurrentUserId();
        this.pageSize = this.postsService.paginationPageSize;
        this.currentPage = this.postsService.paginationCurrentPage;

        this.postsService.getPosts(this.postsService.paginationPageSize, this.postsService.paginationCurrentPage);

        this.postsSubDestroy = this.postsService.getListPost()
            .subscribe(res => {
                if (res) {
                    this.postLists = res;
                    this.pageLength = res.maxCount;
                }
            }, error => {
                alert('Some error ocured !!!');
            });

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

    deletePost(id: string) {
        this.postsService.deletePost(id);
    }

    pageChnaged(event: Event) {
        this.postsService.getPosts(event['pageSize'], event['pageIndex'] + 1);
        this.postsService.paginationPageSize = event['pageSize'];
        this.postsService.paginationCurrentPage = event['pageIndex'] + 1;
    }

    ngOnDestroy() {
        if (this.postsSubDestroy) {
            this.postsSubDestroy.unsubscribe();
        }
    }
}