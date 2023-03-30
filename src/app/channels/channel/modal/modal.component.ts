import { Component, Input, OnInit, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { RefreshService } from 'src/app/shared/refresh.service';
import { ApiService } from '../../api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/shared/data.service';
import { ActivatedRoute } from '@angular/router';

import { IPosts } from 'src/app/models/posts.model';

@Component({
  selector: 'app-posts-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements  OnInit{
  _isModalOpen: boolean=false;

  title:string="Create Post"

  _posts:IPosts[] = []
  postId:string=""
  postContent:string = "";

  /* postModalId:string = '' */
  submitError:string="";
  createMode = true;

  @Input() postModalId!:string

  resetModal(){
    this.title="Create Post"
    this.postContent = ''
      this.createMode = true;
      this.postId = ''
  }

  @Input() 
  set postData(val:any){
    if(val==null){
      this.createMode=true;
      this.title="Create Post"
      this.postContent=""
    }
    else{
      this.title="Edit Post"
      this.postContent = val.content
      this.createMode = false;
      this.postId = val._id
    }
  }

  @Input()
  set isModalOpen(val: boolean) {
    this.isModalOpenChange.emit(val);
    this._isModalOpen = val;
  }
  get isModalOpen() {
    return this._isModalOpen;
  }
  @Output() isModalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private api:ApiService,
    private refreshService:RefreshService,
    private message:NzMessageService,
    private dataService:DataService,
    private route:ActivatedRoute
  ){

  }

  ngOnInit():void{
  }

  handleModalOk(){
    this.postContent=this.postContent.trim()
    if(this.postContent==""){
      this.submitError="Post Content Cannot Be Empty"
      return
    }
    this.submitError="" 

    if(this.createMode)
      this.api.addPost(this.postContent,this.route.snapshot.paramMap.get('id'))
      .subscribe({
        next:res=>{
          this.message.success(`Post Created`)
          this.refreshService.refreshPosts.next(true)
          this.isModalOpen=false
          this.resetModal()
        },
        error:err=>{
          console.log(err)
          this.message.error(err.error.message)
        }
      })
    else
      this.api.updatePost(this.postContent,this.postId,this.route.snapshot.paramMap.get('id'))
        .subscribe({
          next:res=>{
            this.message.success('Post Editted!')
            this.refreshService.refreshPosts.next(true)
            this.isModalOpen=false
            this.resetModal()
          },
          error:err=>{
            console.log(err)
            this.message.error(err.error.message)
          }
        })

    /* this.api.addPost(this.postModalContent).subscribe({
      next:res=>{
        this.message.success(`Channel ${this.postModalContent} Created Successfully`)
        this.refreshService.refreshChannels.next(true)
        this.isModalOpen=false
      },error:err=>{
        console.log(err)
        if(err?.error?.error?.code==409) return this.message.error(err.error.error.message)
        return this.message.error("Error Creating Channel")
      }
    }) */
  }

  closeModal(){
    this.isModalOpen=false
  }
  
}
