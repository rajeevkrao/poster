import { Component,isDevMode } from '@angular/core';
import { GlobalApiService } from './globalApi.service';
import { Router, NavigationEnd } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title:string = 'Poster';
  test:boolean = false;
  ngRoute:string = "";
  loggedIn:boolean = false
  isSuperUser:boolean = false

  constructor(
    protected testApi: GlobalApiService,
    private router:Router,
    private cookieService:CookieService,
  ) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e:any) => {
       this.ngRoute=e.url;
       this.checkServer();
       this.checkLoginStatus();
       this.checkSuperUser();
      })
  }

  ngOnInit(){
    this.checkServer();
    this.checkLoginStatus();
    this.checkSuperUser();
  }

  checkSuperUser(){
    this.testApi.isSuperUser().then(()=>this.isSuperUser=true).catch(err=>this.isSuperUser=false)
  }

  checkLoginStatus(){
    if(this.cookieService.get('session'))
      this.loggedIn = true
    if(this.cookieService.get('session') == "")
      this.loggedIn = false
  }

  checkServer(){
    this.testApi.test().then(res=>{
      this.test = true;
    }).catch(err=>{
      this.test = false;
    })
  }

  runTest(){
    console.log(this.isSuperUser)
  }

  route(route:String){
    this.router.navigate([route])
  }
}
