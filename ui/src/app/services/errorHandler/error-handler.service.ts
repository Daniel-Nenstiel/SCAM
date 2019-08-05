import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  missingData() {
    console.error(
      {
        'message': 'Missing Data',
        'status': 400
      }
    )
  }
}
