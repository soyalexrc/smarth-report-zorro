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
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzTypographyModule} from "ng-zorro-antd/typography";
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
    NzGridModule,
    NzDrawerModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
    NzSpinModule,
    NzTypographyModule
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
