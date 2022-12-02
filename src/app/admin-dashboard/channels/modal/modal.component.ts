import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'app-channels-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements  OnInit{
  _isModalOpen: boolean=false;
  channelModalName:string = "";
  submitError:string="";
  @Input()
  set isModalOpen(val: boolean) {
    this.isModalOpenChange.emit(val);
    this._isModalOpen = val;
  }
  get isModalOpen() {
    return this._isModalOpen;
  }
  @Output()
  isModalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit():void{
  }

  closeModal(){
    this.isModalOpen=false
  }
  
}
