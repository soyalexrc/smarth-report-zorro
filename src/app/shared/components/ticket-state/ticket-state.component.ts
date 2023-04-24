import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-state',
  templateUrl: './ticket-state.component.html',
  styleUrls: ['./ticket-state.component.scss']
})
export class TicketStateComponent {
  @Input() status!: string;
}
