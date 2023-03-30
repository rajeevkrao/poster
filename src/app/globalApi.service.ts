import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
  protected apiUrl = '/api'
  constructor(protected http:HttpClient) {
    if(isDevMode())
      this.apiUrl="http://localhost:5000/api"
  }

  test():Observable<void | any>{
      return this.http
        .post(this.apiUrl+"/test",{},{responseType:'text'})
  }

  jwtVerify(token:string):Observable<void|any>{
    return this.http.post(this.apiUrl+'/jwtverify',{token},{responseType: 'text'})
  }

  isSuperUser():Observable<void|any>{   
    return this.http.post(this.apiUrl+"/issuperuser",{},{withCredentials:true})
  }

  protected error(error:any,reject?:any){
    reject(error)
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}
