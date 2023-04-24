import {Component} from '@angular/core';
import {TicketValidationService} from "../../../../services/ticket-validation.service";
import * as moment from 'moment';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

interface Ticket {
  id: null | string | number
  status: string
  username: null | string
  C_NRO_SERIE: string
  C_NRO_DOC: string
  C_APAMNO_RAZON_SOCIAL_ADQUIRIENTE: string
  C_TIP_DOC_ADQUIRIENTE: string | number
  C_NRO_DOC_ADQUIRIENTE: string | number
  C_MONEDA: string
  C_TOTAL_OPERACIONES_GRAV: string | number
  C_MONTO_TOTAL_IGV: string | number
  C_MONTO_PAGAR: string | number
  C_FEC_CREA_FACE: string
  C_ID_ITEM: string | number
  C_DESRIP_ITEM: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  date = '';
  series = '';
  ticketNumber = '';
  name = '';
  dni = '';
  serviceName = '';

  listOfData: Ticket[] = [];
  loading = false;
  confirmModal?: NzModalRef; // For testing by now

  constructor(private tv: TicketValidationService, private modal: NzModalService) {
  }

  onChange($event: any) {
    console.log($event)
  }

  getTickets() {
    this.loading = true;
    const rangeOne = moment(this.date[0]).format().slice(0, 10)
    const rangeTwo = moment(this.date[1]).format().slice(0, 10)

    const customDate = `${rangeOne}#${rangeTwo}`

    const filters = [
        {
          field:"C_FEC_CREA_FACE",
          value: customDate
        }
      ];

    if (!this.getFilter(filters, 'C_NRO_DOC_ADQUIRIENTE')) {
      if (this.dni) {
        filters.push({
          field: 'C_NRO_DOC_ADQUIRIENTE',
          value: this.dni
        })
      }
    }

    if (!this.getFilter(filters, 'C_NRO_DOC')) {
      if (this.ticketNumber) {
        filters.push({
          field: 'C_NRO_DOC',
          value: this.ticketNumber
        })
      }
    }
    if (!this.getFilter(filters, 'C_NRO_SERIE')) {
      if (this.series) {
        filters.push({
          field: 'C_NRO_SERIE',
          value: this.series
        })
      }
    }
    if (!this.getFilter(filters, 'C_APAMNO_RAZON_SOCIAL_ADQUIRIENTE')) {
      if (this.name) {
        filters.push({
          field: 'C_APAMNO_RAZON_SOCIAL_ADQUIRIENTE',
          value: this.name
        })
      }
    }
    if (!this.getFilter(filters, 'C_DESRIP_ITEM')) {
      if (this.serviceName) {
        filters.push({
          field: 'C_DESRIP_ITEM',
          value: this.serviceName
        })
      }
    }
    this.tv.getTickets(filters).subscribe(data =>  {
      this.listOfData = data;
      this.loading = false
    })
  }

  getFilter(filters: any, param: string) {
    return filters.some((x: any) => x.field === param)
  }


  cancel() {

  }

  confirm(row: Ticket): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `Quieres validar el ticket ${row.C_NRO_SERIE} - ${row.C_NRO_DOC}?`,
      nzContent: 'Una vez validado solo podra cambiar el estado mediante el administrador',
      // nzOnOk: () =>
      //   new Promise((resolve, reject) => {
      //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      //   }).catch(() => console.log('Oops errors!'))
      nzOnOk: () => this.validateTicket(row)
    });
  }

  validateTicket(ticket: Ticket) {
    const t = {...ticket};
    t.username = 'admin';
    this.tv.validateTicket(t).subscribe(data => {
      console.log(data)
    })
  }
}
