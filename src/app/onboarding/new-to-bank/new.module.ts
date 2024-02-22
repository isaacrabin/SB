import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentficationComponent } from './identfication/identfication.component';
import { IonicModule } from '@ionic/angular';
import { NewRoutingModule } from './new-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdScanComponent } from './id-scan/id-scan.component';
import { PreferenceComponent } from './preference/preference.component';
import { SelfieComponent } from './selfie/selfie.component';
import {WebcamModule} from 'ngx-webcam';
import { ApiService } from 'src/app/_services/api.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { OccupationComponent } from './occupation/occupation.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';




@NgModule({
  declarations: [
    IdentficationComponent,
    IdScanComponent,
    PreferenceComponent,
    SelfieComponent,
    OccupationComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true
    }),
    NewRoutingModule,
    NgxIntlTelInputModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ScrollingModule,
    CdkVirtualScrollViewport,
    ReactiveFormsModule,
    IonicSelectableComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[ApiService,HttpClient]
})
export class NewModule { }
