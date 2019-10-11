import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { BaseRequestService } from '../baseRequest/base-request.service';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';

import { Observable } from 'rxjs';
import { RequestData } from 'src/app/models/request-data.model';
import { Endpoints } from 'src/app/helpers/endpoints';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends BaseRequestService {

  constructor(
    http: HttpClient,
    error: ErrorHandlerService
    ) {
    super(http, error);
   }

   getTest(): Observable<any>{
    const req = new RequestData();
    req.table = Endpoints.API_TEST_ENDPOINT;
    return super.get(req);
   }
   
   createSomething(table: { [prefix: string] :string }, something: any|any[]): Observable<any>{
     const req = new RequestData();
     req.table = table;
     req.body = something;
     return super.post(req);
   }

  readSomething(reqDat: RequestData): Observable<any>{
    return super.get<any>(reqDat);
  }

  readUsersByUsername(username: string) {
    const req = new RequestData();
    req.table = Endpoints.GENERIC_USER_ENDPOINT;
    req.params = new Map([
      ['username', username]
    ]);

    return super.get(req);
  }

  readUsers(limit: number, offset: number): Observable<User[][]> {
    const req = new RequestData();
    req.table = Endpoints.GENERIC_USER_ENDPOINT
    req.query = {
      limit: limit,
      offset: offset
    }
    
    return super.get<User[][]>(req);
  }

  readTable(table: string){

  }

  updateSomething(reqDat: RequestData){
    return super.put<any>(reqDat);
  }

  login(username: string, password: string): Observable<any> {
    const req = new RequestData();
    req.table = Endpoints.SPECIFIC_LOGIN_ENDPOINT
    req.body = {
      username: username,
      password: password
    }
    
    return super.put(req);
  }

  createUser(user: User): Observable<any> {
    const req = new RequestData();
    req.table = Endpoints.SPECIFIC_CREATE_USER;
    req.body = user;

    return super.post(req);
  }
}
