import { Component,OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiService } from '../api.service';

import { IChannels } from 'src/app/models/channels.model';

import { RefreshService } from 'src/app/shared/refresh.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  isChannelModalOpen:boolean = false;
  window=window

  channels:Array<IChannels> = []
  constructor(
    private api:ApiService,
    private message:NzMessageService,
    private refreshService:RefreshService
  ){

    
  }

  ngOnInit():void{
    this.refreshService.refreshChannels.subscribe({
      next:res=>{
        this.loadChannels();
      }
    })
    this.loadChannels();
    
  }

  loadChannels(){
    this.api.getMetaChannels()
      .subscribe({
        next:res=>this.channels = res,
        error:err=>console.log(err)
      })
      .add(()=>{
        this.channels.forEach(channel=>{
          let time = new Date(channel.creationTimestamp)
          channel.date = time.toLocaleDateString('en-IN');
        })
      })
  }

  modalTest(){
    console.log(this.isChannelModalOpen)
  }

  deleteChannelConfirm(name:string):void{
    this.api.deleteChannel(name)
      .subscribe({
        next:()=>{
          this.ngOnInit();
          this.refreshService.refreshChannels.next(true)
          this.message.success("Channel Deleted")
        },
        error:()=>{
          this.message.error("Error Deleting the Channel")
        }
      })
  }

}
