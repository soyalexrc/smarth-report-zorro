import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStateComponent } from './components/ticket-state/ticket-state.component';
import { TicketTableComponent } from './components/ticket-table/ticket-table.component';
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
@NgModule({
  declarations: [
    TicketStateComponent,
    TicketTableComponent,
  ],
  imports: [
    CommonModule,
    NzPopconfirmModule,
    NzTableModule
  ],
  exports: [
    TicketStateComponent,
    TicketTableComponent,
  ]
})
export class SharedModule { }
