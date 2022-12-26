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

  getPosts(channel:string|null, page?:number):Observable<void|any>{
    return this.http.post(this.apiUrl+'/posts',{channel,page},{withCredentials:true})
  }

  addPost(content:string, channel:string|null):Observable<void|any>{
    return this.http.put(this.apiUrl+'/posts',{content,channel},{withCredentials:true})
  }

  updatePost(content:string, id:string, channel:string|null):Observable<void|any>{
    return this.http.patch(this.apiUrl+'/posts',{channel,content,id},{withCredentials:true})
  }

  deletePost(channel:string|null,postId:string):Observable<void|any>{
    return this.http.delete(this.apiUrl+'/posts',{withCredentials:true,body:{channel,postId}})
  }
}
