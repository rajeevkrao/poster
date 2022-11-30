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
  constructor(
    private router:Router,
    private cookieService:CookieService,
    private api:ApiService,
    private message:NzMessageService
  ){
    
    this.api.jwtVerify(this.cookieService.get('session')).catch(err=>{
      this.router.navigate(['/login'])
    })
    this.api.getUsers(this.cookieService.get('session')).then((res)=>{
      this.users=res
    }).catch(err=>{
      this.message.error("Cannot Retreive Users")
    })
  }

  ngOnInit(): void {
    
  }
}
