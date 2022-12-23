import { Component, Input, OnInit, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { RefreshService } from 'src/app/shared/refresh.service';
import { ApiService } from '../../api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-channels-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements  OnInit,OnChanges{
  _isModalOpen: boolean=false;
  channelModalName:string = "";
  submitError:string="";
  channelName:string=""

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
    

  }

  handleModalOk(){
    this.channelModalName=this.channelModalName.trim()
    if(this.channelModalName==""){
      this.submitError="Channel Name Cannot Be Empty"
      return
    }
    this.submitError="" 
    this.api.addChannel(this.channelModalName).subscribe({
      next:res=>{
        this.message.success(`Channel ${this.channelModalName} Created Successfully`)
        this.refreshService.refreshChannels.next(true)
        this.isModalOpen=false
        /* this.channelModalName="" */
      },error:err=>{
        console.log(err)
        if(err?.error?.error?.code==409) return this.message.error(err.error.error.message)
        return this.message.error("Error Creating Channel")
      }
    })
  }

  closeModal(){
    this.isModalOpen=false
  }
  
}
