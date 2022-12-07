import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels:Array<string> = []

  constructor(
    private api:ApiService,
    private cookieService:CookieService,
    private router:Router,
    private message:NzMessageService
  ){
    
  }

  ngOnInit(): void {
    this.api.jwtVerify(this.cookieService.get('session'))
    .subscribe({
      error:err=>{
        this.router.navigate(['/login'])
      }
    })

    this.loadChannels();
  }

  loadChannels(){
    this.api.getChannels().subscribe({
      next:res=>{
        this.channels = res
      },
      error:err=>{
        this.message.error("Error Retrieving Channels")
      }
    })
  }
}
