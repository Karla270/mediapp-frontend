import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Sign } from '../model/sign';

@Injectable({
  providedIn: 'root'
})
export class SingService extends GenericService<Sign>{

  signChange = new Subject<Sign[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/signs`
      );
  }
  
  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

   setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
