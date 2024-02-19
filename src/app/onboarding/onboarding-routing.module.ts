import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DocsRequiredComponent } from './docs-required/docs-required.component';
import { AccountOptionsComponent } from './account-options/account-options.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Onboard',
  },
  {
    path: 'docs-required',
    component: DocsRequiredComponent,
    title: 'Docs',
  },
  {
    path: 'account-options',
    component: AccountOptionsComponent,
    title: 'Docs',
  },
  {
    path: 'new-to-bank',
    component: AuthComponent,
    title: 'Onboard',
    loadChildren: () => import('./new/new.module').then(m => m.NewModule)
  },
  {
    path: 'existing-on-bank',
    component: AuthComponent,
    title: 'Onboard',
    loadChildren: () => import('./exisiting/exisiting.module').then(m => m.ExisitingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
