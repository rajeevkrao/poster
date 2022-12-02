import { Component,OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiService } from '../api.service';

import { IChannels } from 'src/app/models/channels.model';



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
    private message:NzMessageService
  ){

    
  }

  ngOnInit():void{
    this.api.getMetaChannels().then(res=>this.channels = res).catch(err=>console.log(err)).finally(()=>{
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
    this.api.deleteChannel(name).then(()=>{
      this.ngOnInit();
      this.message.success("Channel Deleted")
    })
    .catch(()=>{
      this.message.error("Error Deleting the Channel")
    })
  }

}
