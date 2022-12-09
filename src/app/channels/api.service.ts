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

  getChannels():Observable<void|any>{
      return this.http.post(this.apiUrl+"/channels/name",{},{withCredentials:true})
  }

  getPosts(channel:string|null):Observable<void|any>{
    return this.http.post(this.apiUrl+'/posts',{channel},{withCredentials:true})
  }

  addPost(content:string):Observable<void|any>{
    return this.http.put(this.apiUrl+'/posts',{content},{withCredentials:true})
  }

  updatePost(content:string, id:string):Observable<void|any>{
    return this.http.put(this.apiUrl+'/posts',{content,id},{withCredentials:true})
  }

  deletePost(id:string):Observable<void|any>{
    return this.http.delete(this.apiUrl+'/posts',{withCredentials:true,body:{id}})
  }
}
