import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly basePath = 'http://dny15158.macincloud.com:8080/api'

  constructor(
    private http: HttpClient,
  ) { }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.basePath}/admin/users/role/${role}` )
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.basePath}/authorities` )
  }
}
