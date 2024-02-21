import { PreferenceComponent } from './preference/preference.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentficationComponent } from './identfication/identfication.component';
import { OccupationComponent } from './occupation/occupation.component';
import { SelfieComponent } from './selfie/selfie.component';
import { IdScanComponent } from './id-scan/id-scan.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'identification',
    pathMatch:'full'
  },
  {
    path: 'identification',
    component: IdentficationComponent,
  },
  {
    path: 'occupation',
    component: OccupationComponent,
  },
  {
    path: 'preferences',
    component: PreferenceComponent,
  },
  {
    path: 'selfie',
    component: SelfieComponent,
  },
  {
    path: 'id-scan',
    component: IdScanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRoutingModule { }
