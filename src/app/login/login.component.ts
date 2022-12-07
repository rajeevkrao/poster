import { Component, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginError:String = ""
  validateForm!: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private api:ApiService,
    private router:Router
  ){
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm():void{
    let { email, password } = this.validateForm.value;
    this.api.login(email,password)
      .subscribe({
        next:res=>{
          this.loginError=""
          this.router.navigate([res.redirect])
        },
        error:err=>{
          this.loginError="Username or Password doesn't Exist"
        }
      })
  }

  onSubmit(form:NgForm){
    
  }
}
