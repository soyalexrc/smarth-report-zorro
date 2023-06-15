import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Ticket} from "../../../core/interfaces/ticket";


@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss'],
})
export class TicketTableComponent {
  @Input() data: Ticket[] = [];
  @Input() showValidationFunction!: boolean;

  @Output() confirm: EventEmitter<Ticket> = new EventEmitter<Ticket>()
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>()

  size = 10;
  offset = 0;
  page = 1

  handlePagination(event: any) {
    this.page = event;
    this.offset = event - 1;
  }

  dataPaginated(): Ticket[] {
    return this.data.slice( this.offset * this.size, this.size * this.offset + this.size)
  }

  getPages(data: Ticket[]) {
    // return Math.ceil(data.length / this.size)
    return data.length
  }

}
