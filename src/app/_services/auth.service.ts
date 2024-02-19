import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  sbgUrl = environment.sbgsUrl;

  constructor(
    private http: HttpClient
  ) { }

  verifyID(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'auth', payload);
  }
}
