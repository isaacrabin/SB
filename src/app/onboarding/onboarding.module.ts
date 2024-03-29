import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { IonicModule } from '@ionic/angular';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule} from 'ngx-toastr';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../_services/api.service';
import { DocsRequiredComponent } from './docs-required/docs-required.component';
import { DataStoreService } from '../_services/data-store.service';
import { OtpFormComponent } from './auth/otp-form/otp-form.component';
import { AccountOptionsComponent } from './account-options/account-options.component';
import { SelectAccountComponent } from './account-options/select-account/select-account.component';
import { CameraComponent } from '../_components/camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LivenessComponent } from './liveness/liveness.component';
import { SummaryComponent } from './summary/summary.component';
import { SuccessComponent } from './success/success.component';
import { LottieComponent, LottieDirective } from 'ngx-lottie';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AuthComponent,
    DocsRequiredComponent,
    OtpFormComponent,
    AccountOptionsComponent,
    SelectAccountComponent,
    CameraComponent,
    LivenessComponent,
    SummaryComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    WebcamModule,
    LottieComponent,
    LottieDirective,


    ReactiveFormsModule,
    ScrollingModule,
    OnboardingRoutingModule,
    NgxIntlTelInputModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    IonicSelectableComponent
  ],
  providers:[ApiService,DataStoreService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingModule { }
