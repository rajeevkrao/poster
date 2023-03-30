import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';


import { CookieService } from 'ngx-cookie-service';

import { NzGridModule } from 'ng-zorro-antd/grid';


@NgModule({
  declarations: [
    ChannelsComponent
  ],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    NzMessageModule,
    NzGridModule,
    NzButtonModule
  ],
  providers:[CookieService,]
})
export class ChannelsModule { }
