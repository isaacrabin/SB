import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferenceComponent } from './preference/preference.component';
import { SummaryComponent } from '../summary/summary.component';
import { IdentificationComponent } from './identification/identification.component';

const routes: Routes = [
  {
    path: 'preferences',
    component: PreferenceComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'identidication',
    component: IdentificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExisitingRoutingModule { }
