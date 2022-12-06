import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { ApiService } from '../../api.service';
import { RefreshService } from 'src/app/refresh.service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-users-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {

  isInviteUserModalOpen:boolean = false;
  inviteUserModalTitle!:string;
  inviteUserModalName:string = "";
  inviteUserModalEmail:string = "";
  inviteUserModalAccesses:any = {};
  inviteUserModalCreateMode:boolean = true;

  channels:Array<string> = []

  _isModalOpen: boolean=false;
  /* _index:number = -1; */
  channelModalName:string = "";
  submitError:string="";

  /* @Input() set channel(val:Array<string>){
    this.channels=val
  } */

  @Input() /* index!:number */
   set index(val: number){
    if(val==-1){
      this.inviteUserModalTitle="Invite New User"  
      this.inviteUserModalCreateMode=true;
    } 
    else{
      this.inviteUserModalTitle="Editting for"
      this.inviteUserModalCreateMode=false;
    } 
  }/*
  get index(){
    reutrn this._index
  } */

  // @Output() indexChange: EventEmitter<number> = new EventEmitter<number>();

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
    private dataService:DataService
  ){

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isModalOpen'])
      this.channelModalName=""
  }

  ngOnInit():void{
    this.dataService.channels.subscribe({
      next:res=>{
        
      }
    })
    this.dataService.users.subscribe({
      next:res=>{
        console.log(res)
      }
    })
  }

  handleModalOk(){
    const emailRe = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    this.inviteUserModalName=this.inviteUserModalName.trim()
    this.inviteUserModalEmail=this.inviteUserModalEmail.trim()
    if(this.inviteUserModalName==""){
      this.submitError="Name cannot be Empty"
      return ;
    }
    if(this.inviteUserModalEmail=="" || !emailRe.test(this.inviteUserModalEmail)){
      this.submitError="Not a Valid Email"
      return;
    }

    this.submitError=""

    if(this.inviteUserModalCreateMode)
      this.api.addUser(this.inviteUserModalName,this.inviteUserModalEmail,this.inviteUserModalAccesses)
      .then(res=>{
        this.message.success("User Successfully Added")
        this.isInviteUserModalOpen=false;
        this.ngOnInit()
      })
      .catch(err=>{
        let error = JSON.parse(err?.error)
        console.log(error.errcode)
        if(error?.code==11000)
          this.message.error(error.message)
        else
          this.message.error("User cannot be added due to some error")
        
      })
    else this.api.updateUser(this.inviteUserModalName,this.inviteUserModalEmail,this.inviteUserModalAccesses)
      .then(res=>{
        this.message.success("User Updated Successfully")
        this.isInviteUserModalOpen=false;
        this.ngOnInit()
      })
      .catch(err=>{
        let error = JSON.parse(err?.error)
        console.log(error.errcode)
        if(error?.code==11000)
          this.message.error(error.message)
        else
          this.message.error("User cannot be added due to some error")
      })
  }

  closeModal(){
    this.isModalOpen=false
  }

}
