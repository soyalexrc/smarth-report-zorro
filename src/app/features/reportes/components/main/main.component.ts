import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import * as moment from "moment/moment";
import {TicketValidationService} from "../../../../core/services/ticket-validation.service";
import {ExportExcelService} from "../../../../core/services/export-excel.service";
import {AuthService} from "../../../../core/services/auth.service";
import {Ticket} from "../../../../core/interfaces/ticket";
import {User, UserByRole} from "../../../../core/interfaces/auth";
import {ExportPdfService} from "../../../../core/services/export-pdf.service";
import {Subscription} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../../core/services/user.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  dateFrom = '';
  dateTo = '';
  date = '';
  series = '';
  ticketNumber = '';
  name = '';
  dni = '';
  serviceName = '';
  pdfLoading = false;
  excelLoading = false;

  listOfData: Ticket[] = [];
  listOfUsersByRole: UserByRole[] = [];
  loading = false;
  confirmModal?: NzModalRef; // For testing by now
  user!: User;
  exportableStateSubscription = new Subscription()
  showTable: any
  showLoader = false;
  isSmallScreen = window.innerWidth < 1180;


  @ViewChild('pdfTable') pdfTable!: ElementRef
  visible = false;
  dateValidated = '';
  dateValidatedFrom = ''
  dateValidatedTo = ''

  constructor(
    private tv: TicketValidationService,
    private excelService: ExportExcelService,
    private authService: AuthService,
    private pdfService: ExportPdfService,
    private message: NzMessageService,
    private auth: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.auth.validateSession();
    this.user = this.authService.getTokenDecoded()
    this.getUsersByRole();
    this.getTickets()
    this.exportableStateSubscription = this.pdfService.exportableState
      .subscribe(value => {
        this.showTable = value
      })
    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 1180;
    })
  }

  ngOnDestroy() {
    this.exportableStateSubscription.unsubscribe()
    window.removeEventListener('resize', () => {
    });
  }


  onChange($event: any) {
    console.log($event)
  }

  getTickets() {
    this.loading = true;
    const rangeOne = moment(this.isSmallScreen ? this.dateFrom : this.date[0]).format().slice(0, 10)
    const rangeTwo = moment(this.isSmallScreen ? this.dateTo : this.date[1]).format().slice(0, 10)

    const validatedRangeOne = moment(this.isSmallScreen ? this.dateValidatedFrom : this.dateValidated[0]).format().slice(0, 10);
    const validatedRangeTwo = moment(this.isSmallScreen ? this.dateValidatedTo : this.dateValidated[0]).format().slice(0, 10);

    const customValidatedDate = `${validatedRangeOne}#${validatedRangeTwo}`;


    const customDate = `${rangeOne}#${rangeTwo}`

    const filters: any = [];


    if (!this.getFilter(filters, 'C_FEC_CREA_FACE')) {
      if (Boolean((this.dateFrom && this.dateTo) || this.date)) {
        filters.push({
          field: 'C_FEC_CREA_FACE',
          value: customDate
        })
      }
    }
    if (!this.getFilter(filters, 'fecha_creacion')) {
      if (Boolean((this.dateValidatedFrom && this.dateValidatedTo) || this.dateValidated)) {
        filters.push({
          field: 'fecha_creacion',
          value: customValidatedDate
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
          value: this.series.toUpperCase()
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


    this.tv.getTicketsByUserName(this.user?.sub).subscribe(data => {
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

  exportToPdf() {
    this.showLoader = true
    this.pdfService.updateExportableState(true)
    setTimeout(() => {
      const pages = document.querySelector('.all-pages') as HTMLElement;
      this.pdfService.exportToPdfWithCanvas(pages).then(() => {
        this.pdfService.updateExportableState(false)
        this.showLoader = false
        this.message.create('success', 'Se descargo el pdf con exito!', {})
      });
      // this.pdfService.exportAllToPdf(pages).then(() => {
      //   this.pdfService.updateExportableState(false)
      //   this.showLoader = false
      //   this.message.create('success', 'Se descargo el pdf con exito!', {})
      // })
    }, 1000)
  }

  getFilter(filters: any, param: string) {
    return filters.some((x: any) => x.field === param)
  }


  getTotal() {
    let total = 0;

    for (let i = 0; i < this.listOfData.length; i++) {
      total += +this.listOfData[i].C_MONTO_PAGAR
    }

    return total;
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getUsersByRole() {
    if (this.user?.auth.includes('JEFE')) {
      console.log(this.user.auth)
      this.userService.getUsersByRole(this.user?.auth.replace('JEFE_', '')).subscribe(value => {
        console.log(value)
      })
    }
  }

  get isServiceBoss() {
    return this.user.auth.includes('JEFE');
  }
}
