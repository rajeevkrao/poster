import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
  protected apiUrl = '/api'
  constructor(protected http:HttpClient) {
    if(isDevMode())
      this.apiUrl="http://localhost:5000/api"
  }

  test():Promise<void | any>{
    return new Promise((resolve,reject)=>{
      this.http
        .post(this.apiUrl+"/test",{},{responseType:'text'})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
        /* (
          res=>resolve(res),
          err=>this.error(err,reject)) */
      /* axios.post(this.apiUrl+"/test").then(res=>{
        resolve(res.data);
      }).catch(err=>this.error(err,reject)) */
    })
  }

  jwtVerify(token:string):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.apiUrl+'/jwtverify',{token},{responseType: 'text'})
        .subscribe(({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        }))
    })
  }

  isSuperUser():Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.apiUrl+"/issuperuser",{},{withCredentials:true})
      .subscribe({
        next:res=>resolve(res),
        error:err=>this.error(err,reject)
      })
    })
  }

  protected error(error:any,reject?:any){
    reject(error)
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}
