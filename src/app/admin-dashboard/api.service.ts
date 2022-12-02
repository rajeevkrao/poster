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

  jwtVerify(token:string):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.apiUrl+'/jwtverify',{token},{responseType: 'text'})
        .subscribe(({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        }))
    })
  }

  getMetaChannels():Promise<void|any>{
    return new Promise(async(resolve,reject)=>{
      await this.http.post(this.apiUrl+"/channels",{},{withCredentials:true})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
    })
  }

  getUsers():Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.apiUrl+"/users/invited",{},{withCredentials:true})
        .subscribe(({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        }))
    })
  }

  getChannels():Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.apiUrl+"/channels/name",{},{withCredentials:true})
        .subscribe(({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        }))
    })
  }

  addUser(name:string,email:string,accesses:any):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.put(this.apiUrl+"/users/invited",{name,email,accesses},{withCredentials:true,responseType:"text"})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
    })
  }

  updateUser(name:string,email:string,accesses:any):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.patch(this.apiUrl+"/users/invited",{name,email,accesses},{withCredentials:true,responseType:"text"})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
    })
  }

  deleteUser(id:string):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.delete(this.apiUrl+"/users/invited",{withCredentials:true, body:{id}})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
    })
  }

  deleteChannel(name:string):Promise<void|any>{
    return new Promise((resolve,reject)=>{
      this.http.delete(this.apiUrl+"/channels",{withCredentials:true,body:{name}})
        .subscribe({
          next:res=>resolve(res),
          error:err=>this.error(err,reject)
        })
    })
  }
}
