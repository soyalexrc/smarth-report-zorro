import {Component, OnInit} from '@angular/core';
import {ExportPdfService} from "../../../../core/services/export-pdf.service";
import {TicketValidationService} from "../../../../core/services/ticket-validation.service";
import {Ticket} from "../../../../core/interfaces/ticket";
import {groupBy, handleCustomCurrencyFormat} from "../../../../shared/utils";

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html',
  styleUrls: ['./export-pdf.component.scss']
})
export class ExportPdfComponent implements OnInit {
  ticketsToReport: Ticket[] | any[] = [];
  userType = '';
  protected readonly handleCustomCurrencyFormat = handleCustomCurrencyFormat;

  constructor(
    private pdfService: ExportPdfService,
    private ticketService: TicketValidationService
  ) {
  }


  ngOnInit() {
    const requestInfo = JSON.parse(localStorage.getItem('request-info') ?? '');
    const {user, type, filters, roles} = requestInfo;
    this.userType = type;
    console.log(this.userType);
    if (type === 'user') {
      this.ticketService.getTicketsByUserNameAndFilters(user, filters).subscribe(response => {
        this.ticketsToReport = response;
        console.log(response);
      })
    } else {
      this.ticketService.getTicketsByServiceWithFilters(roles, filters).subscribe(response => {
        // this.ticketsToReport = response;
        this.ticketsToReport = Array.from(groupBy(response, (x: Ticket) => x.serviceName))
        console.log(Array.from(groupBy(response, (x: Ticket) => x.serviceName)));

      })
    }

  }


  getTotal() {

    let total = 0;

    for (let i = 0; i < this.ticketsToReport.length; i++) {
      total += +this.ticketsToReport[i].C_MONTO_PAGAR
    }

    return total;
  }


  handlePrint() {
    this.pdfService.exportSimplePdf();
  }

  getTotalByGroup(data: any[]) {
    let total = 0;

    for (let i = 0; i < data.length; i++) {
      total += +data[i].C_MONTO_PAGAR
    }

    return total;
  }

  getLastTotal() {
    const data = this.ticketsToReport.map(source => source[1]).flat()
    let total = 0;

    for (let i = 0; i < data.length; i++) {
      total += +data[i].C_MONTO_PAGAR
    }

    return total;

  }
}
