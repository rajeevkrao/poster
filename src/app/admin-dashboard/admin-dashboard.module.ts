import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ChannelsComponent } from './channels/channels.component';
import { ModalComponent } from './channels/modal/modal.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    ChannelsComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    NzTabsModule,
    NzGridModule,
    NzTableModule,
    NzButtonModule,
    NzMessageModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzFormModule,
    NzPopconfirmModule
  ],
  providers:[CookieService]
})
export class AdminDashboardModule{ }
