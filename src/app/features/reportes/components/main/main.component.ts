import {Component, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import * as moment from "moment/moment";
import {TicketValidationService} from "../../../../services/ticket-validation.service";
import {ExportExcelService} from "../../../../services/export-excel.service";
import {AuthService} from "../../../../services/auth.service";
import {Ticket} from "../../../../core/interfaces/ticket";
import {User} from "../../../../core/interfaces/auth";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  date = '';
  series = '';
  ticketNumber = '';
  name = '';
  dni = '';
  serviceName = '';
  pdfLoading = false;
  excelLoading = false;

  listOfData: Ticket[] = [];
  loading = false;
  confirmModal?: NzModalRef; // For testing by now
  user!: User;

  constructor(
    private tv: TicketValidationService,
    private excelService: ExportExcelService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getTokenDecoded()
    this.getTickets()

  }


  onChange($event: any) {
    console.log($event)
  }

  getTickets() {
    this.loading = true;
    const rangeOne = moment(this.date[0]).format().slice(0, 10)
    const rangeTwo = moment(this.date[1]).format().slice(0, 10)

    const customDate = `${rangeOne}#${rangeTwo}`


    this.tv.getTicketsByUserName(this.user?.sub).subscribe(data =>  {
      this.listOfData = data;
      console.log(data);
      this.loading = false
    })
  }

  exportToExcel() {
    const data = this.listOfData.map((data: Ticket) => {
      return {
        "Ticket": `${data.C_NRO_SERIE} - ${data.C_NRO_DOC}`,
        "Paciente": data.C_APAMNO_RAZON_SOCIAL_ADQUIRIENTE,
        "DNI": `${data.C_NRO_DOC_ADQUIRIENTE} - ${data.C_TIP_DOC_ADQUIRIENTE}`,
        "Fecha": data.C_FEC_CREA_FACE,
        "Servicio": data.C_DESRIP_ITEM,
        "Moneda": data.C_MONEDA,
        "Monto": data.C_TOTAL_OPERACIONES_GRAV,
        "IGV": data.C_MONTO_TOTAL_IGV,
        "Total": data.C_MONTO_PAGAR
      }
    })
    this.excelService.exportToExcel(
      data,
      'Reporte-' + new Date().getTime() + '.xlsx'
    );
  }

  exportToPdf() {}
}
