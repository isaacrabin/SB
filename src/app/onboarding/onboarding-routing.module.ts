import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DocsRequiredComponent } from './docs-required/docs-required.component';
import { AccountOptionsComponent } from './account-options/account-options.component';
import { LivenessComponent } from './liveness/liveness.component';
import { SummaryComponent } from './summary/summary.component';
import { SuccessComponent } from './success/success.component';

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
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'liveness',
    component: LivenessComponent,
  },
  {
    path: 'new',
    loadChildren: () => import('./new-to-bank/new.module').then(m => m.NewModule)
  },
  {
    path: 'existing',
    loadChildren: () => import('./exisiting-on-t24/exisiting.module').then(m => m.ExisitingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
