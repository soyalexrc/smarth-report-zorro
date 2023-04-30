import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStateComponent } from './components/ticket-state/ticket-state.component';
import { TicketTableComponent } from './components/ticket-table/ticket-table.component';
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
@NgModule({
  declarations: [
    TicketStateComponent,
    TicketTableComponent,
  ],
  imports: [
    CommonModule,
    NzPopconfirmModule,
    NzTableModule,
    NgxDatatableModule,
    NzGridModule,
    NzCollapseModule,
    NzPaginationModule
  ],
  exports: [
    TicketStateComponent,
    TicketTableComponent,
  ]
})
export class SharedModule { }
