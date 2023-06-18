import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import {Route, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {SharedModule} from "../../shared/shared.module";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzSelectModule} from "ng-zorro-antd/select";


const routes: Route[]  = [
  {
    path: '',
    component: MainComponent
  }
]

@NgModule({
  declarations: [
    MainComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        NzBreadCrumbModule,
        NzButtonModule,
        NzDatePickerModule,
        NzIconModule,
        NzInputModule,
        NzPopconfirmModule,
        NzTableModule,
        NzWaveModule,
        SharedModule,
        NzSpinModule,
        NzAlertModule,
        NzDrawerModule,
        NzSelectModule
    ]
})
export class ReportesModule { }
