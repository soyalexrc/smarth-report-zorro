import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  user: any;
  isCollapsed = false;
  confirmModal?: NzModalRef; // For testing by now
  visible = false;
  isSmallScreen = window.innerWidth < 900;
  constructor(
    private auth: AuthService,
    private modal: NzModalService,
    private router: Router,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.uiService.isLayoutDrawerVisible.subscribe(value => {
      this.visible = value;
    });
    const userRaw = this.auth.getTokenDecoded();
    this.user = {
      name: userRaw.sub,
      nameShort: userRaw.sub?.slice(0, 2).toUpperCase(),
      role: userRaw.auth?.split(',').map(this.formatRole)
    }
    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 900;
    })
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {});
  }

  logout() {
    this.confirmModal = this.modal.confirm({
      nzTitle: `Quieres cerrar la sesion?`,
      nzContent: '',
      nzOnOk: () => {
        localStorage.removeItem('sr-token')
        this.router.navigate(['/autenticacion'])
      }
    })
  }

  open(): void {
    this.uiService.showLayoutDrawer();
  }

  close(): void {
    this.uiService.hideLayoutDrawer();
  }

  formatRole(role: string) {
    return role.split('_').join(' ')
  }

  get isServiceBoss() {
    return this.user.role[0].includes('SERVICIO') || this.user.role[0].includes('ADMIN');
  }

  handleRouting() {
    this.uiService.hideLayoutDrawer();
    // this.router.navigate([route]);
  }
}
