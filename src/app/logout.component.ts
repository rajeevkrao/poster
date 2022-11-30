import { Component } from "@angular/core"
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent{
  constructor(
    private cookieService:CookieService,
    private router:Router
  ){
    this.cookieService.delete("session")
    this.router.navigateByUrl('/')
  }
}