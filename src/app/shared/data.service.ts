import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  channels = new Subject<Array<string>>();

  users = new Subject<Array<IUser>>();
}
