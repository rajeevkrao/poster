import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

import { NzMessageService } from 'ng-zorro-antd/message';
 

import { ApiService } from './api.service';

import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  passwordError:string = ''
  validateForm!: UntypedFormGroup;

  constructor(
    private router:Router,
    private fb: UntypedFormBuilder,
    private api:ApiService,
    private cookieService:CookieService,
    private message:NzMessageService
  ){

  }

  ngOnInit(): void {
    this.api.jwtVerify(this.cookieService.get('invitee'))
      .subscribe({
        error:err=>{
          console.log(err)
          this.router.navigate(['/'])
        }
      })
      /* .catch(err=>{
      console.log(err)
      this.router.navigate(['/'])
    }) */

    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  submitForm():void{
    let { password,confirmPassword } = this.validateForm.value;
    if(password!=confirmPassword){
      this.passwordError="Passwords don't match"
      return
    } 
    if(password.length<=8){
      this.passwordError="Password too short"
      return
    } 
    if(password.length>=24){
      this.passwordError="Password too long"
      return
    } 
    this.passwordError=""
    this.api.setPassword(password).subscribe({
      next:res=>{
        this.cookieService.deleteAll()
        this.router.navigate(['/login'])
      },
      error:err=>{
        console.log(err)
        this.message.error(err?.error?.error?.message)
      }
    })
  }
}
