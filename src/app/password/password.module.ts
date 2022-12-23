import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password.component';

import { CookieService } from 'ngx-cookie-service';

import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [
    PasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordRoutingModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule
  ],
  providers:[CookieService]
})
export class PasswordModule { }
