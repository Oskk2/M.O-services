import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentyService {
  private apiUrl = 'https://v6.exchangerate-api.com/v6/f7efb02ab73fb34638b8fbd7/latest/USD'; 

  constructor(private http: HttpClient) {}

  getExchangeRate(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
