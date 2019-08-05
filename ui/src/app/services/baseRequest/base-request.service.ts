import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestData } from 'src/app/models/request-data.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseRequestService {
  private static readonly api_URL = environment.API_URL;
  private requestData: RequestData;

  private defaultHeaders: HttpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(
    public http: HttpClient,
    private error: ErrorHandlerService
    ) {
      this.requestData = new RequestData();
  }

  protected post(req: RequestData): Observable<any> {
    this.requestData = req;

    if(!this.requestData.hasOwnProperty('body')) this.error.missingData();
    else {
      return this.http.post(
        this.buildURL(), 
        this.requestData.body, 
        { headers: this.defaultHeaders }
      )
    }
  }

  protected get<T>(req: RequestData): Observable<T> {
    this.requestData = req;

    return this.http.get<T>(
      this.buildURL(), 
      { headers: this.defaultHeaders }
    )
  }

  private buildURL() {
    let fullURL = BaseRequestService.api_URL;
    fullURL += '/' + Object.keys(this.requestData.table)[0] + '/' + this.requestData.table[Object.keys(this.requestData.table)[0]]
    
    if(this.requestData.hasOwnProperty('params')) {
      this.requestData.params.forEach((value, key) => {
        fullURL += value === null ? '/' + key.toString() : '/' + key.toString() + '/' + value.toString()
      })
    }
    // console.log(fullURL);
    return fullURL;
  }
}
