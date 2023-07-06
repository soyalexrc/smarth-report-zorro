import {Component, OnInit} from '@angular/core';
import {ExportPdfService} from "../../../../core/services/export-pdf.service";
import {TicketValidationService} from "../../../../core/services/ticket-validation.service";
import {Ticket} from "../../../../core/interfaces/ticket";
import {handleCustomCurrencyFormat} from "../../../../shared/utils";

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html',
  styleUrls: ['./export-pdf.component.scss']
})
export class ExportPdfComponent implements OnInit {
  ticketsToReport: Ticket[] = [];

  constructor(
    private pdfService: ExportPdfService,
    private ticketService: TicketValidationService
  ) {
  }


  ngOnInit() {
    const requestInfo = JSON.parse(localStorage.getItem('request-info') ?? '');
    this.ticketService.getTicketsByUserNameAndFilters(requestInfo.user, requestInfo.filters).subscribe(response => {
      this.ticketsToReport = response;
    })
  }


  getTotal() {
    let total = 0;

    for (let i = 0; i < this.ticketsToReport.length; i++) {
      total += +this.ticketsToReport[i].C_MONTO_PAGAR
    }

    return total;
  }

  protected readonly handleCustomCurrencyFormat = handleCustomCurrencyFormat;

  handlePrint() {
    this.pdfService.exportSimplePdf();
  }
}
