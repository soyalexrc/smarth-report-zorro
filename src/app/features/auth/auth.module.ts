import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import {Route, RouterModule} from "@angular/router";
import {NzInputModule} from "ng-zorro-antd/input";
import {IconsProviderModule} from "../../icons-provider.module";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";


const routes: Route[]  = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzInputModule,
    IconsProviderModule,
    NzToolTipModule,
    FormsModule,
    NzButtonModule,
    NzCheckboxModule
  ]
})
export class AuthModule { }
