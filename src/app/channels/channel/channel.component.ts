import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { IPosts } from 'src/app/models/posts.model';

import { ApiService } from '../api.service';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit{

  posts:IPosts[] = []

  channelName:string|null  = ''

  isPostModalOpen:boolean = false;

  constructor(
    private api:ApiService,
    private route:ActivatedRoute,
    private router:Router,
    private message:NzMessageService
  ){

  }
  
  ngOnInit(): void {
    this.channelName=this.route.snapshot.paramMap.get('id')
    this.api.getChannels().subscribe({
      next:res=>{
        if(!res.includes(this.route.snapshot.paramMap.get('id'))){
          this.message.error("Not a Valid Channel");
          this.router.navigate(["/channels"])
        }
      }
    })

    this.api.getPosts(this.route.snapshot.paramMap.get('id')).subscribe({
      next:res=>{
        this.posts = res;
      },
      error:err=>{
        this.message.error("Cannot Fetch Posts")
      }
    }).add(()=>{
      this.posts.forEach(post=>{
        post.timeRelation = formatRelative(post.creationTimestamp, new Date())
      })
    })
  }
}
