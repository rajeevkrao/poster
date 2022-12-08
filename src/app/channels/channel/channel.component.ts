import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit{

  channels:string[] = []

  constructor(
    private api:ApiService,
    private route:ActivatedRoute,
    private router:Router,
    private message:NzMessageService
  ){

  }
  
  ngOnInit(): void {
      this.api.getChannels().subscribe({
        next:res=>{
          /* this.channels = res; */
          if(!res.includes(this.route.snapshot.paramMap.get('id'))){
            this.message.error("Not a Valid Channel");
            this.router.navigate(["/channels"])
          }
            
          
        }
      })
  }
}
