import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import * as moment from "moment/moment";
import {TicketValidationService} from "../../../../core/services/ticket-validation.service";
import {ExportExcelService} from "../../../../core/services/export-excel.service";
import {AuthService} from "../../../../core/services/auth.service";
import {Ticket} from "../../../../core/interfaces/ticket";
import {User, UserByRole} from "../../../../core/interfaces/auth";
import {ExportPdfService} from "../../../../core/services/export-pdf.service";
import {forkJoin, map, Subscription} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../../core/services/user.service";
import {handleCustomCurrencyFormat} from "../../../../shared/utils";
import {Router} from "@angular/router";
import {UiService} from "../../../../core/services/ui.service";

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
  rolesLoading = false;
  servicesLoading = false;
  filterByCreatedDate = true;

  userRoleToSearch: any;
  currentRoleToSearch: any;
  serviceToSearch: any;
  listOfData: Ticket[] = [];
  listOfUsersByRole: UserByRole[] = [];
  listOfRoles: string[] = []
  listOfServices: any = [];
  loading = false;
  confirmModal?: NzModalRef; // For testing by now
  user!: User;
  exportableStateSubscription = new Subscription()
  showTable: any
  showLoader = false;
  isSmallScreen = window.innerWidth < 1180;

  private swipeCoord?: [number, number];
  private swipeTime?: number;


  @ViewChild('pdfTable') pdfTable!: ElementRef
  visible = false;
  dateValidated = '';
  dateValidatedFrom = ''
  dateValidatedTo = ''

  isBoss = false;

  constructor(
    private tv: TicketValidationService,
    private excelService: ExportExcelService,
    private authService: AuthService,
    private pdfService: ExportPdfService,
    private message: NzMessageService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.auth.validateSession();
    this.user = this.authService.getTokenDecoded()
    if (this.isServiceBoss) {
      this.listOfRoles = this.user.auth.split(',').map(role => role.replace('SERVICIO_', ''));
      // this.getUsersByRoles();
    }
    if (this.isAdmin) {
      this.getServices();
    }
    if (!this.isServiceBoss && !this.isAdmin) {
      this.getTickets()
    }
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
    if ($event.length === 0) {
      this.date = '';
      this.dateFrom = '';
      this.dateTo = '';
    }
  }

  getTickets() {
    this.uiService.updateGlobalLoading(true);
    this.loading = true;
    const rangeOne = moment(this.isSmallScreen ? this.dateFrom : this.date[0]).format().slice(0, 10)
    const rangeTwo = moment(this.isSmallScreen ? this.dateTo : this.date[1]).format().slice(0, 10)
    const customDate = `${rangeOne}#${rangeTwo}`
    const filters: any = [];

    console.log(this.filterByCreatedDate);

    if (!this.getFilter(filters, 'fecha_creacion')) {
      if (Boolean((this.dateFrom && this.dateTo) || this.date)) {
        filters.push({
          field: this.filterByCreatedDate ? 'created_date' : 'fecha_creacion',
          value: customDate
        })
      }
    }

    if (!this.getFilter(filters, 'numero_doc_adquiriente')) {
      if (this.dni) {
        filters.push({
          field: 'numero_doc_adquiriente',
          value: this.dni
        })
      }
    }

    if (!this.getFilter(filters, 'numero_documento')) {
      if (this.ticketNumber) {
        filters.push({
          field: 'numero_documento',
          value: this.ticketNumber
        })
      }
    }
    if (!this.getFilter(filters, 'descripcion_item')) {
      if (this.series) {
        filters.push({
          field: 'descripcion_item',
          value: this.series.toUpperCase()
        })
      }
    }
    if (!this.getFilter(filters, 'razon_social')) {
      if (this.name) {
        filters.push({
          field: 'razon_social',
          value: this.name
        })
      }
    }
    if (!this.getFilter(filters, 'descripcion_item')) {
      if (this.serviceName) {
        filters.push({
          field: 'descripcion_item',
          value: this.serviceName
        })
      }
    }


    if (this.isAdmin) {
      const requestInfo = {
        filters,
        user: {},
        roles: [this.serviceToSearch],
        type: 'admin'
      }
      localStorage.setItem('request-info', JSON.stringify(requestInfo));
      this.tv.getTicketsByServiceWithFilters([this.serviceToSearch], filters).subscribe(result => {
        this.listOfData = result;
      }, () => {
        this.loading = false
        this.uiService.updateGlobalLoading(false);
      }, () => {
        this.loading = false
        this.uiService.updateGlobalLoading(false);
      })
    } else {
      const requestInfo = {
        filters,
        user: {},
        roles: this.userRoleToSearch === 'all' ? [this.currentRoleToSearch] : [...this.listOfRoles],
        type: 'bossService'
      }
      localStorage.setItem('request-info', JSON.stringify(requestInfo));
      if (this.userRoleToSearch === 'all' || this.currentRoleToSearch === 'all') {
        this.tv.getTicketsByServiceWithFilters(this.userRoleToSearch === 'all' ? [this.currentRoleToSearch] : [...this.listOfRoles], filters).subscribe(result => {
          this.listOfData = result;
        }, () => {
          this.loading = false
          this.uiService.updateGlobalLoading(false);
        }, () => {
          this.loading = false
          this.uiService.updateGlobalLoading(false);
        })
      } else {
        const requestInfo = {
          filters,
          user: this.userRoleToSearch ? this.userRoleToSearch : this.user?.sub,
          type: 'user'
        }
        localStorage.setItem('request-info', JSON.stringify(requestInfo));
        this.tv.getTicketsByUserNameAndFilters(this.userRoleToSearch ? this.userRoleToSearch : this.user?.sub, filters).subscribe(data => {
          this.listOfData = data;
        }, () => {
          this.loading = false
          this.uiService.updateGlobalLoading(false);
        }, () => {
          this.loading = false
          this.uiService.updateGlobalLoading(false);
        })
      }
    }

    this.visible = false;
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
        "Monto": handleCustomCurrencyFormat(data.C_TOTAL_OPERACIONES_GRAV, 'double'),
        "IGV": handleCustomCurrencyFormat(data.C_MONTO_TOTAL_IGV, 'double'),
        "Total": handleCustomCurrencyFormat(data.C_MONTO_PAGAR, 'double')
      }
    })
    this.excelService.exportToExcel(
      data,
      'Reporte-' + new Date().getTime() + '.xlsx'
    );
  }

  exportToPdf() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/export-pdf'])
    );
    window.open(url, '_blank')
    // this.showLoader = true
    // this.pdfService.updateExportableState(true)
    // setTimeout(() => {
    //   const pages = document.querySelector('.all-pages') as HTMLElement;
    //   this.pdfService.exportToPdfWithCanvas(pages).then(() => {
    //     this.pdfService.updateExportableState(false)
    //     this.showLoader = false
    //     this.message.create('success', 'Se descargo el pdf con exito!', {})
    //   });
    // this.pdfService.exportAllToPdf(pages).then(() => {
    //   this.pdfService.updateExportableState(false)
    //   this.showLoader = false
    //   this.message.create('success', 'Se descargo el pdf con exito!', {})
    // })
    // }, 1000)
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

  getUsersByRole(role: string) {
    if (role === 'all') {
      this.listOfUsersByRole = [];
      this.userRoleToSearch = '';
      return;
    }
    this.rolesLoading = true;
    this.userService.getUsersByRole(role).subscribe(res => {
      this.listOfUsersByRole = res;
    }, _ => {}, () => {this.rolesLoading = false})
    // const rolesHttpReq = roles.map(role => {
    //   return this.userService.getUsersByRole(role);
    // })
    // forkJoin(rolesHttpReq).subscribe(res => {
    //   this.listOfUsersByRole = res.flat()
    // }, _ => {}, () => {this.rolesLoading = false})
  }


  getServices() {
    this.servicesLoading = true;
    const role = this.user?.auth.replace('SERVICIO_', '')
    this.userService.getServices().subscribe(value => {
      this.listOfServices = value.filter((service: string) => !service.includes('SERVICIO') && !service.includes('ADMIN') && !service.includes('USER'));
    }, _ => {
    }, () => this.servicesLoading = false)
  }

  get isServiceBoss() {
    return this.user.auth.includes('SERVICIO');
  }

  get isAdmin() {
    return this.user.auth.includes('ADMIN');
  }

  formatServiceDisplay(service: string) {
    const initial = service.charAt(0);
    const content = service.slice(1, service.length).toLowerCase();
    const result = initial + content;
    return result.replace('ROLE', '').replace('_', ' ')
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord![0], coord[1] - this.swipeCoord![1]];
      const duration = time - this.swipeTime!;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        if (swipe === 'next') {
          this.visible = true;
        } else {
          this.uiService.showLayoutDrawer();
        }
      }
    }
  }


}
