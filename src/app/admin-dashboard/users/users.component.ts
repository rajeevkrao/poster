import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { IUser } from 'src/app/models/users.model';

import { ApiService } from '../api.service';

import { NzMessageService } from 'ng-zorro-antd/message';

import { CookieService } from 'ngx-cookie-service';

import { RefreshService } from 'src/app/refresh.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:Array<IUser> = []

  channels:Array<string> = []

  isUsersModalOpen:boolean = false;

  isInviteUserModalOpen:boolean = false;
  inviteUserModalTitle:string = "Invite New User";
  inviteUserModalName:string = "";
  UserModalIndex:number = -1;
  inviteUserModalEmail:string = "";
  inviteUserModalAccesses:any = {};
  inviteUserModalCreateMode:boolean = true;

  constructor(
    private api:ApiService,
    private message:NzMessageService,
    private cookieService:CookieService,
    private router:Router,
    private refreshService:RefreshService,
    private dataService:DataService
  ){

  }

  ngOnInit(){
    //Verifying jwt token
    this.api.jwtVerify(this.cookieService.get('session')).catch(err=>{
      this.router.navigate(['/login'])
    })

    //Listening to Channels Changes
    this.refreshService.refreshChannels.subscribe({
      next:res=>this.loadData(),
      error:err=>console.log(err)
    })

    //load Channels and Users
    

    this.loadData();
  }

  async loadData():Promise<void>{
    await this.getChannels()
    this.getUsers()
  }

  async getChannels(){
    await this.api.getChannels().then((res)=>{
      this.dataService.channels.next(res)
      this.channels=res
    }).catch(err=>{
      this.message.error("Cannot Retreive Channels")
    })
  }

  //Retrieving Users
  getUsers(){
    this.api.getUsers().then((res)=>{
      this.users=res
      this.users.forEach((user,index)=>{
        this.users[index].accesses = this.channels.reduce((channels:any,channel)=>{
          if(Object.keys(user.accesses).includes(channel))
            channels[channel] = this.users[index].accesses[channel]
          return channels
        },{})
      })
      this.dataService.users.next(this.users)
    }).catch(err=>{
      console.log(err)
      this.message.error("Cannot Retreive Users")
    })
  }

  showInviteUserModal(index:number){
    this.UserModalIndex = index
    this.isUsersModalOpen=true;
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

}
