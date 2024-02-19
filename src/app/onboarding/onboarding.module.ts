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

@NgModule({
  declarations: [
    AuthComponent,
    DocsRequiredComponent,
    OtpFormComponent,
    AccountOptionsComponent,
    SelectAccountComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,

    ReactiveFormsModule,
    OnboardingRoutingModule,
    NgxIntlTelInputModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers:[ApiService,DataStoreService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingModule { }
