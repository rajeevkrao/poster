import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit{
  constructor(
    private cookieService:CookieService,
    private router:Router
  ){
    
  }

  ngOnInit(): void {
    /* this.cookieService.delete("session")
    this.cookieService.delete("invitee")
    this.router.navigateByUrl('/login') */
    this.cookieService.deleteAll('/')
    /*this.cookieService.get('session')*/
    this.router.navigateByUrl('/login')
  }
}