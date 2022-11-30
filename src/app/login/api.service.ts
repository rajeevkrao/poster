import { Injectable } from '@angular/core';
import { GlobalApiService } from '../globalApi.service';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class ApiService extends GlobalApiService {
  
  constructor(protected override http:HttpClient) { 
    super(http);
  }

  login(email:String,password:String):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http
        .post(this.apiUrl+"/login",{email,password},{withCredentials:true})
        .subscribe(({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        }))
    })
  }
}
