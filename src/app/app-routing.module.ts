import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard'
import {MainLayoutComponent} from "./core/layouts/main-layout/main-layout.component";
import {AuthLayoutComponent} from "./core/layouts/auth-layout/auth-layout.component";
import {ExportPdfComponent} from "./features/reportes/components/export-pdf/export-pdf.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/reportes' },
      {
        path: 'validacion-de-tickets',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/validacion-tickets/validacion-tickets.module').then(m => m.ValidacionTicketsModule),
      },
      {
        path: 'reportes',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/reportes/reportes.module').then(m => m.ReportesModule),
      },
      {
        path: 'export-pdf',
        component: ExportPdfComponent,
        canActivate: [AuthGuard],
      }
    ]
  },
  {
    path: 'autenticacion',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
