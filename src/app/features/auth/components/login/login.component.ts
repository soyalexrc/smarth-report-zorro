import { Component, TemplateRef } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/services/auth.service";
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordVisible = false;
  password: any;
  username: any;
  remember= false

  constructor(private router: Router, private auth: AuthService, private message: NzMessageService) {}

  login() {
    this.auth.login(this.username, this.password, this.remember).subscribe(data => {
      this.auth.setToken(data.id_token)
      this.router.navigate(['/'])
      this.showMessage('success', `Bienvenid@, ${this.username}`)

    }, error => {
      this.showMessage('error', (error.error.detail || 'Ocurrio un error inesperado, por favor prueba mas tarde...'))
    })
  }

  showMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
