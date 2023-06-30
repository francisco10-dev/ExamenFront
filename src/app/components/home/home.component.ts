import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { CategoryService } from 'src/app/services/category.service';
import {ActivatedRoute,Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { server } from 'src/app/services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[PostService,CategoryService]
})
export class HomeComponent {
  public posts:Array<Post>;
  private checkPost;
  private checkAutorization;
  public identity:any;
  public url:string;
  public word:any;
  constructor(
    private _postService:PostService,
    private _categoryService:CategoryService,
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router
  ){
    this.posts=[];
    this.url=server.url;
    this.loadPost();
    this.identity=this._userService.getIdentity();
    this.checkPost=setInterval(()=>{
      this.loadPost();
    },10000);
    this.checkAutorization=setInterval(()=>{
      this.identity=this._userService.getIdentity();
    },1000);
  }
  loadPost(){
    let idCat;
    this._route.params.subscribe(
      params=>{
        idCat=params['id'];
      }
    );
    if(idCat){
      this.getPostsByCategory(idCat);
    }else{
      this.getPosts();
    }    
  }
  private getPostsByCategory(id:number){
    this._categoryService.getCategory(id).subscribe(
      {
        next: (response:any)=>{
          if(response.status==200){
            //console.log(response);
            this.posts=response.data.posts;
          }else{
            this._router.navigate(['']);
          }
        },
        error:(error:Error)=>{

        }
      }
    );
  }
  private getPosts(){
    this._postService.getPosts().subscribe({
      next:(response:any)=>{
        
        if(response.status==200){
          this.posts=response.data;
          console.log(this.posts);
        }
      },
      error:(err:Error)=>{

      }
    });
  }

  delete(id:number){
    console.log("Eliminando el post "+id);
  }

  public filter(){
    this._postService.getPostsByTitle(this.word).subscribe({
      next:(response:any)=>{
        if(response.status==200){
          this.posts = response.data;
          console.log(this.posts);
        }
      },
      error:(err:Error)=>{
        console.log(err);
      }
    });
  }

}
