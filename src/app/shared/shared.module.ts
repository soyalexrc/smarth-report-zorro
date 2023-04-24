import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStateComponent } from './components/ticket-state/ticket-state.component';
@NgModule({
  declarations: [
    TicketStateComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TicketStateComponent
  ]
})
export class SharedModule { }
