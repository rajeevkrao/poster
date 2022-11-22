import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api'
  constructor(private http:HttpClient) {
    if(isDevMode())
      this.apiUrl="http://localhost:5000/api"
  }

  test():Promise<void | any>{
    return new Promise((resolve,reject)=>{
      this.http
        .post(this.apiUrl+"/test",{test:"test"},{responseType:'text'})
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

  private error(error:any,reject?:any){
    reject(error)
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}
