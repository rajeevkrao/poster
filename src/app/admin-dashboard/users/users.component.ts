import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/users.model';

import { ApiService } from '../api.service';

import { NzMessageService } from 'ng-zorro-antd/message';

import { CookieService } from 'ngx-cookie-service';

import { RefreshService } from 'src/app/shared/refresh.service';
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
    this.api.jwtVerify(this.cookieService.get('session'))
      .subscribe({
        error:err=>{
          this.router.navigate(['/login'])
        }
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

  //Retreiving Channel Names
  getChannels():Promise<void>{
    return new Promise((resolve,reject)=>{
      this.api.getChannels()
        .subscribe({
          next:(res)=>{
            this.dataService.channels.next(res)
            this.channels=res
            resolve()
          },
          error:err=>{
            this.message.error("Cannot Retreive Channels")
          }
        })
    })
    
  }

  //Retrieving Users
  getUsers(){
    this.api.getUsers()
      .subscribe({
        next:(res)=>{
          this.users=res
          this.users.forEach((user,index)=>{
            this.users[index].accesses = this.channels.reduce((channels:any,channel)=>{
              if(Object.keys(user.accesses).includes(channel))
                channels[channel] = this.users[index].accesses[channel]
              return channels
            },{})
          })
          this.dataService.users.next(this.users)
        },
        error:err=>{
          console.log(err)
          this.message.error("Cannot Retreive Users")
        }
      })
  }

  showInviteUserModal(index:number){
    this.UserModalIndex = index
    this.isUsersModalOpen=true;
  }

  deleteUserConfirm(id:string){
    this.api.deleteUser(id)
      .subscribe({
        next:()=>{
          this.loadData();
          this.message.success("User Deleted")
        },
        error:()=>{
          this.message.error("Error Deleting the User")
        }
      })
  }

  deleteUserCancel(){
    
  }

}
