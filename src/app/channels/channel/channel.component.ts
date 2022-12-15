import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { IPosts } from 'src/app/models/posts.model';

import { ApiService } from '../api.service';
import { RefreshService } from 'src/app/shared/refresh.service';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnChanges{

  posts:IPosts[] = []

  channelName:string|null  = ''

  isPostModalOpen:boolean = false;

  editId:number = -1;

  editPostData:any = {}

  createMode = true;

  page:number=0;

  throttle = 200;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private api:ApiService,
    private route:ActivatedRoute,
    private router:Router,
    private message:NzMessageService,
    private refreshService:RefreshService
  ){

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isModalOpen'])
      this.editId = -1
  }
  
  ngOnInit(): void {
    
    this.channelName=this.route.snapshot.paramMap.get('id')
    this.refreshService.refreshPosts.subscribe({
      next:res=>{
        this.loadPosts();
      }
    })
    this.api.getChannels().subscribe({
      next:res=>{
        if(!res.includes(this.route.snapshot.paramMap.get('id'))){
          this.message.error("Not a Valid Channel");
          this.router.navigate(["/channels"])
        }
      }
    })
    this.loadPosts();
  }

  onUp(){

  }

  onScrollDown(){
    console.log("Scrolled Down")
    this.api.getPosts(this.route.snapshot.paramMap.get('id'),++this.page).subscribe({
      next:res=>{
        this.posts = [...this.posts,...res]
      },
      error:err=>{
        this.message.error("Error Fetching Posts")
      }
    }).add(()=>{
      this.posts.forEach(post=>{
        post.timeRelation = formatRelative(post.creationTimestamp, new Date())
      })
    })
    /* this.posts = [...this.posts,...this.posts] */
  }

  loadPosts(){
    this.api.getPosts(this.route.snapshot.paramMap.get('id')).subscribe({
      next:res=>{
        this.posts = res;
        this.page=0
      },
      error:err=>{
        this.message.error(err.error?.message)
        this.router.navigate(['channels'])
      }
    }).add(()=>{
      this.posts.forEach(post=>{
        post.timeRelation = formatRelative(post.creationTimestamp, new Date())
      })
    })
  }

  addPost(){
    this.isPostModalOpen=true
    this.createMode = true
    this.editId = -1
    this.editPostData = null
  }

  deletePost(id:string){
    this.api.deletePost(this.route.snapshot.paramMap.get('id'),id).subscribe({
      next:res=>{
        this.message.success("Post Deleted!")
        this.loadPosts();
      },
      error:err=>{
        this.message.error(err.error.message)
        /* this.message.error("Error Deleting Post") */
      }
    })
  }

  editPost(id:number){
    this.isPostModalOpen=true;
    this.editId=id;
    this.createMode=false;
    this.editPostData = this.posts[id]
  }

}

