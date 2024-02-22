import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExisitingRoutingModule } from './exisiting-routing.module';
import { PreferenceComponent } from './preference/preference.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastrModule } from 'ngx-toastr';
import { IdentificationComponent } from './identification/identification.component';
import { ESummaryComponent } from './e-summary/e-summary.component';



@NgModule({
  declarations: [
    PreferenceComponent,
    IdentificationComponent,
    ESummaryComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true
    }),
    ExisitingRoutingModule,
    NgxIntlTelInputModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableComponent
  ]
})
export class ExisitingModule { }
