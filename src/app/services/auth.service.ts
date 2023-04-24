import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly basePath = 'http://dny15158.macincloud.com:8080/api'


  constructor(public jwtHelper: JwtHelperService, private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('sr-token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(username: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(`${this.basePath}/authenticate`, {username, password, remember})
  }
}
