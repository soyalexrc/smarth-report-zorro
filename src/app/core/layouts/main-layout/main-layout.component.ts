import { Component } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isCollapsed = false;
  confirmModal?: NzModalRef; // For testing by now

  constructor(private auth: AuthService, private modal: NzModalService, private router: Router) {
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
}
