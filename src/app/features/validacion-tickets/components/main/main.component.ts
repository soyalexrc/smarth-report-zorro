import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TicketValidationService} from "../../../../core/services/ticket-validation.service";
import * as moment from 'moment';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Ticket} from "../../../../core/interfaces/ticket";
import {AuthService} from "../../../../core/services/auth.service";
import {User} from "../../../../core/interfaces/auth";
import {NzNotificationService} from "ng-zorro-antd/notification";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {
  date = '';
  dateFrom = '';
  dateTo = '';
  series = '';
  ticketNumber = '';
  name = '';
  dni = '';
  serviceName = '';

  listOfData: Ticket[] = [];
  loading = false;
  confirmModal?: NzModalRef; // For testing by now
  user!: User;
  visible = false;
  isSmallScreen = window.innerWidth < 900;


  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>

  constructor(
    private tv: TicketValidationService,
    private modal: NzModalService,
    private authService: AuthService,
    private notification: NzNotificationService
    ) {
  }

  ngOnInit() {
    this.user = this.authService.getTokenDecoded()
    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 900;
    })
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {});
  }

  onChange($event: any) {
    console.log($event)
  }

  getTickets() {
    this.visible = false;
    this.loading = true;
    console.log(this.isSmallScreen)
    const rangeOne = moment(this.isSmallScreen ? this.dateFrom : this.date[0]).format().slice(0, 10)
    const rangeTwo = moment(this.isSmallScreen ? this.dateTo : this.date[1]).format().slice(0, 10)

    const customDate = `${rangeOne}#${rangeTwo}`
    console.log(customDate);

    const filters: any = [];

      if (!this.getFilter(filters, 'C_FEC_CREA_FACE')) {
        if (this.isSmallScreen) {
          console.log('here')
          console.log(this.dateFrom)
          console.log(this.dateTo)
          if (this.dateFrom && this.dateTo) {
            filters.push({
              field: 'C_FEC_CREA_FACE',
              value: customDate
            })
          }
        } else {

        }if (this.date.length > 0) {
          filters.push({
            field: 'C_FEC_CREA_FACE',
            value: customDate
          })
        }

      }

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
    t.username = this.user.sub;
    this.tv.validateTicket(t).subscribe(data => {
      console.log(data)
      this.showNotification()
      this.getTickets()
    })
  }

  showNotification() {
    this.notification.template(this.notificationTemplate, {})
  }

  handleSample (e: any) {
    console.log(e);
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
