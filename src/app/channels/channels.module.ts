import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';

import { NzMessageModule } from 'ng-zorro-antd/message';

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
    NzGridModule
  ],
  providers:[CookieService,]
})
export class ChannelsModule { }
