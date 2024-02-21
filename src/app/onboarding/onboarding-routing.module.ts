import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DocsRequiredComponent } from './docs-required/docs-required.component';
import { AccountOptionsComponent } from './account-options/account-options.component';
import { IdentficationComponent } from './new/identfication/identfication.component';
import { LivenessComponent } from './liveness/liveness.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'docs-required',
    component: DocsRequiredComponent,
  },
  {
    path: 'account-options',
    component: AccountOptionsComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'liveness',
    component: LivenessComponent,
  },
  {
    path: 'new-to-bank',
    loadChildren: () => import('./new/new.module').then(m => m.NewModule)
  },
  {
    path: 'existing-on-bank',
    loadChildren: () => import('./exisiting/exisiting.module').then(m => m.ExisitingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
