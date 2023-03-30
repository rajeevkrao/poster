import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { ModalComponent } from './modal/modal.component';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    ChannelComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    NzMessageModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    InfiniteScrollModule
  ]
})
export class ChannelModule { }
