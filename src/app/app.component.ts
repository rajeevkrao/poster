import { Component,isDevMode } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'poster';
  test = 'Server is Offline';

  constructor(protected testApi: ApiService) {}

  ngOnInit(){
    this.testApi.test().then(res=>{
      this.test = "Server is Online";
    })
  }
}
