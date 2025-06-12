import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

import { PanelComponent } from './interfaz-admin/pages/panel/panel.component';
import { DocumentosComponent } from './interfaz-admin/pages/documentos/documentos.component';
import { UsuariosComponent } from './interfaz-admin/pages/usuarios/usuarios.component';
import { ReportesComponent } from './interfaz-admin/pages/reportes/reportes.component';
import { ConstanciasComponent } from './interfaz-admin/pages/constancias/constancias.component';
import { DashboardLayoutComponent } from './interfaz-admin/components/dashboard-layout/dashboard-layout.component';
import { ConfiguracionCuentaComponent } from './interfaz-admin/pages/configuracion-cuenta/configuracion-cuenta.component';

import { PanelUserComponent } from './interfaz-usuario/components/pages/panel-user/panel-user.component';
import { ConstTabletsComponent } from './interfaz-usuario/components/pages/const-tablets/const-tablets.component';
import { ConstBiblioComponent } from './interfaz-usuario/components/pages/const-biblio/const-biblio.component';
import { SeguimientoComponent } from './interfaz-usuario/components/pages/seguimiento/seguimiento.component';
import { TramitesComponent } from './interfaz-usuario/components/pages/tramites/tramites.component';
import { DashboardLayoutUserComponent } from './interfaz-usuario/components/dashboard-layout-user/dashboard-layout-user.component';

import { LoginComponent } from './log-out/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [AdminGuard],
    children: [
  { path: 'panel', component: PanelComponent },
  { path: 'documentos', component: DocumentosComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'constancias', component: ConstanciasComponent },
  {
    path: 'configuracion',
    loadComponent: () => import('./interfaz-admin/pages/configuracion-cuenta/configuracion-cuenta.component').then(m => m.ConfiguracionCuentaComponent)
  }
]

  },

  {
    path: 'user',
    component: DashboardLayoutUserComponent,
    canActivate: [UserGuard],
    children: [
      { path: '', redirectTo: 'panel-user', pathMatch: 'full' },
      { path: 'panel-user', component: PanelUserComponent },
      { path: 'const-biblio', component: ConstBiblioComponent },
      { path: 'tramites', component: TramitesComponent },
      { path: 'seguimiento', component: SeguimientoComponent },
      {
        path: 'const-tablets',
        loadComponent: () => import('./interfaz-usuario/components/pages/const-tablets/const-tablets.component').then(m => m.ConstTabletsComponent)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
