import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import {Route, RouterModule} from "@angular/router";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTableModule} from "ng-zorro-antd/table";
import {SharedModule} from "../../shared/shared.module";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";

const routes: Route[]  = [
  {
    path: '',
    component: MainComponent
  }
]

@NgModule({
  declarations: [
    MainComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzBreadCrumbModule,
    NzDatePickerModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzTableModule,
    SharedModule,
    NzEmptyModule,
    NzSpinModule,
    NzPopconfirmModule
  ]
})
export class ValidacionTicketsModule { }
