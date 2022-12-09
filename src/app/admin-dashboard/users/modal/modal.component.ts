import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { ApiService } from '../../api.service';

import { NzMessageService } from 'ng-zorro-antd/message';

import { DataService } from 'src/app/shared/data.service';
import { RefreshService } from 'src/app/shared/refresh.service';

import { IUser } from 'src/app/models/users.model';

@Component({
  selector: 'app-users-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  /* isInviteUserModalOpen:boolean = false; */
  inviteUserModalTitle!:string;
  inviteUserModalName:string = "";
  inviteUserModalEmail:string = "";
  inviteUserModalAccesses:any = {};
  inviteUserModalCreateMode:boolean = true; //True - Create Mode | False - Edit Mode

  users:Array<IUser> = []
  channels:Array<string> = []

  _isModalOpen: boolean=false;
  submitError:string="";

  @Input() /* index!:number */
   set index(val: number){
    if(val==-1){
      this.inviteUserModalTitle="Invite New User"  
      this.inviteUserModalCreateMode=true;
      this.inviteUserModalName=""
      this.inviteUserModalEmail=""
    } 
    else{
      this.inviteUserModalName=this.users[val].name
      this.inviteUserModalEmail=this.users[val].email
      this.inviteUserModalTitle="Editting for: "+this.users[val].name
      this.inviteUserModalCreateMode=false;
      Object.keys(this.users[val].accesses).forEach((channel:string)=>{
        this.inviteUserModalAccesses[channel]=this.users[val].accesses[channel]
      })
    } 
    console.log(this.channels)
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
    private dataService:DataService
  ){

  }

/*   ngOnChanges(changes: SimpleChanges): void {
    if(changes['isModalOpen'])
      {}
  } */

  ngOnInit():void{
    this.dataService.users.subscribe({
      next:res=>{
        this.users = res
      }
    })
    this.dataService.channels.subscribe({
      next:res=>{
        this.channels = res
        this.channels.forEach((channel)=>{
          this.inviteUserModalAccesses[channel]={
            read:false,write:false,delete:false
          }
        })
        console.log(this.channels)
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

    let flag:boolean=false

    for(let channel of Object.keys(this.inviteUserModalAccesses))
      if(this.inviteUserModalAccesses[channel].read || this.inviteUserModalAccesses[channel].write || this.inviteUserModalAccesses[channel].delete)
        flag=true


    if(!flag){
      this.submitError="At least one permission needs to be granted for at least one channel"
      return
    }


    this.submitError=""

    if(this.inviteUserModalCreateMode)
      this.api.addUser(this.inviteUserModalName,this.inviteUserModalEmail,this.inviteUserModalAccesses)
        .subscribe({
          next:res=>{
            this.message.success("User Successfully Added")
            this.refreshService.refreshChannels.next(true)
            this.isModalOpen=false;
          },
          error:err=>{
            let error = JSON.parse(err?.error)
            console.log(error.errcode)
            if(error?.code==11000)
              this.message.error(error.message)
            else
              this.message.error("User cannot be added due to some error")
            
          }
        })
    else this.api.updateUser(this.inviteUserModalName,this.inviteUserModalEmail,this.inviteUserModalAccesses)
        .subscribe({
          next:res=>{
            this.message.success("User Updated Successfully")
            this.refreshService.refreshChannels.next(true)
            this.isModalOpen=false;
          },
          error:err=>{
            let error = JSON.parse(err?.error)
            console.log(error.errcode)
            if(error?.code==11000)
              this.message.error(error.message)
            else
              this.message.error("User cannot be added due to some error")
          }
        })
  }

  closeModal(){
    this.isModalOpen=false
  }

}
