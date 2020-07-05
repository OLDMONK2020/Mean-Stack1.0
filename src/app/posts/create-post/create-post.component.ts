import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent implements OnInit {
    post: object = {};
    mode: string = 'add';
    postID: string;
    imagePreview: any;
    imageFile: any;

    constructor(private postsService: PostsService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postid')) {
                this.postID = paramMap.get('postid');
                this.mode = 'edit';
                this.postsService.getSinglePost(this.postID)
                    .subscribe(res => {
                        if (res && res['data'] && res['status'] === 'success') {
                            this.post = res['data'];
                        }
                    });
            } else {
                this.editPost = null;
                this.mode = 'add';
            }
        });
    }

    saveValue(form: NgForm) {
        if (this.mode === 'add') {
            this.postValue(form);
        } else if (this.mode === 'edit') {
            this.editPost(form);
        }
    }

    postValue(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const post = {
            title: form.value.title,
            content: form.value.content,
            image: this.imageFile
        };
        this.postsService.postPost(post);
        form.resetForm();
    }

    editPost(form: NgForm) {
        const post = {
            id: this.postID,
            title: form.value.title,
            content: form.value.content,
            imagePath: form.value.imagePath,
            image: this.imageFile
        };
        this.postsService.editPost(post, this.postID);
    }

    onImageChange(event: Event) {
        this.imageFile = event.target['files'][0];
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.imageFile);
    }
}