import { Injectable } from '@angular/core';
import { GlobalApiService } from '../globalApi.service';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends GlobalApiService {

  constructor(protected override http:HttpClient) { 
    super(http);
  }

  getMetaChannels():Observable<void|any>{
      return this.http.post(this.apiUrl+"/channels",{},{withCredentials:true})
  }

  getUsers():Observable<void|any>{
      return this.http.post(this.apiUrl+"/users/invited",{},{withCredentials:true})

  }

  getChannels():Observable<void|any>{
      return this.http.post(this.apiUrl+"/channels/name",{},{withCredentials:true})
  }

  addUser(name:string,email:string,accesses:any):Observable<void|any>{
    return this.http.put(this.apiUrl+"/users/invited",{name,email,accesses},{withCredentials:true,responseType:"text"})
  }

  updateUser(name:string,email:string,accesses:any):Observable<void|any>{
    return this.http.patch(this.apiUrl+"/users/invited",{name,email,accesses},{withCredentials:true,responseType:"text"})
  }

  deleteUser(id:string):Observable<void|any>{
      return this.http.delete(this.apiUrl+"/users/invited",{withCredentials:true, body:{id}})
  }

  deleteChannel(name:string):Observable<void|any>{
      return this.http.delete(this.apiUrl+"/channels",{withCredentials:true,body:{name}})
  }

  addChannel(name:string):Observable<void|any>{
    return this.http.put(this.apiUrl+"/channels",{name},{withCredentials:true})
  }
}
