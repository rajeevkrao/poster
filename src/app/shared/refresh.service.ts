import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  constructor() { }

  refreshChannels = new Subject<boolean>();

  refreshPosts = new Subject<boolean>();
}
