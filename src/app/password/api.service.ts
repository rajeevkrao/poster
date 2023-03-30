import { Injectable } from '@angular/core';

import { GlobalApiService } from '../globalApi.service';
import { HttpClient } from "@angular/common/http"

import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService extends GlobalApiService {

  constructor(protected override http:HttpClient) { 
    super(http);
  }

  setPassword(password:string):Observable<void|any>{
    return this.http.post(this.apiUrl+'/password/newuser',{password},{withCredentials:true})
  }
}
