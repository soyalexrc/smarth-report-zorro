import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TicketValidationService {

  private readonly basePath = 'http://dny15158.macincloud.com:8080/api'

  constructor(private http: HttpClient) { }

  getTickets(filters: any): Observable<any> {
    return this.http.post(`${this.basePath}/external/search`, {filters: filters})
  }

  getTicketsByUserName(userName: string): Observable<any> {
    return this.http.get(`${this.basePath}/external/report/${userName}`)
  }

  getTicketsByUserNameAndFilters(userName: string, filters: any): Observable<any> {
    return this.http.post(`${this.basePath}/external/v2/report/${userName}`, {filters: filters})
  }

  getTicketsByService(service: string): Observable<any> {
    return this.http.get(`${this.basePath}/external/report/by-role/${service}`)
  }
  getTicketsByServiceWithFilters(service: string, filters: any): Observable<any> {
    return this.http.post(`${this.basePath}/external/report/by-role/${service}/search`, {filters: filters})
  }

  validateTicket(ticket: any): Observable<any> {
    return this.http.post(`${this.basePath}/external/process`, ticket)
  }
}
