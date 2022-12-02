import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';

import { IUser } from '../models/users.model'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users:Array<IUser> = []
  channels:Array<string> = []

  submitError = ""

  //Invite User Modal Properties
  isInviteUserModalOpen:boolean = false;
  inviteUserModalTitle:string = "Invite New User";
  inviteUserModalName:string = "";
  inviteUserModalEmail:string = "";
  inviteUserModalAccesses:any = {};
  inviteUserModalCreateMode:boolean = true;

  constructor(
    private router:Router,
    private cookieService:CookieService,
    private api:ApiService,
    private message:NzMessageService,
  ){
    
  }

  async ngOnInit(): Promise<void> {
    //Verifying jwt token
    this.api.jwtVerify(this.cookieService.get('session')).catch(err=>{
      this.router.navigate(['/login'])
    })

    //Retrieving Channels
    await this.api.getChannels().then((res)=>{
      this.channels=res
    }).catch(err=>{
      this.message.error("Cannot Retreive Channels")
    })

    //Retrieving Users
    this.api.getUsers().then((res)=>{
      this.users=res
      this.users.forEach((user,index)=>{
        this.users[index].accesses = this.channels.reduce((channels:any,channel)=>{
          if(Object.keys(user.accesses).includes(channel))
            channels[channel] = this.users[index].accesses[channel]
          return channels
        },{})
      })
    }).catch(err=>{
      console.log(err)
      this.message.error("Cannot Retreive Users")
    })

  }

  deleteUserConfirm(id:string){
    this.api.deleteUser(id).then(()=>{
      this.ngOnInit();
      this.message.success("User Deleted")
    })
    .catch(()=>{
      this.message.error("Error Deleting the User")
    })
  }

  deleteUserCancel(){
    
  }

  //Invite User Modal Functions
  showInviteUserModal(index?:number):void{
    this.submitError=""
    this.channels.forEach((channel)=>{
      this.inviteUserModalAccesses[channel]={
        read:false,write:false,delete:false
      }
    })
    if(index!=undefined){
      this.inviteUserModalCreateMode=false
      this.inviteUserModalTitle = "Edit Details for: "+this.users[index].name
      this.inviteUserModalName=this.users[index].name
      this.inviteUserModalEmail=this.users[index].email
      Object.keys(this.users[index].accesses).forEach((channel:string)=>{
        this.inviteUserModalAccesses[channel]=this.users[index].accesses[channel]
      })
    }
    else{
      this.inviteUserModalTitle = "Invite New User";
      this.inviteUserModalName=""
      this.inviteUserModalEmail=""
      this.inviteUserModalCreateMode=true
    }
    /* eval("console.log(`Hello world`)") */
    this.isInviteUserModalOpen=true;
  }

  handleInviteUserModalCancel():void{
    this.isInviteUserModalOpen=false;
  }

  handleInviteUserModalOk():void{
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

}