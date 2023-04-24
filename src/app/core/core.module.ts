import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthGuard} from "./guards/auth.guard";
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {RouterLink, RouterOutlet} from "@angular/router";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {NzGridModule} from "ng-zorro-antd/grid";
// import {HTTP_INTERCEPTORS} from "@angular/common/http";
// import {AuthInterceptor} from "./interceptor/auth.interceptor";

@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterLink,
    RouterOutlet,
    NzGridModule
  ],
  providers: [
    AuthGuard,
    // {
    //   provide : HTTP_INTERCEPTORS,
    //   useClass : AuthInterceptor,
    //   multi : true
    // }
  ]
})
export class CoreModule { }
