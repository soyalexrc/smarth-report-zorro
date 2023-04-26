import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Ticket} from "../../../core/interfaces/ticket";

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent {
  @Input() data!: Ticket[];
  @Input() showValidationFunction!: boolean;

  @Output() confirm: EventEmitter<Ticket> = new EventEmitter<Ticket>()
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>()

}
