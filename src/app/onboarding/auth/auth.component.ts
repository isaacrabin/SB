/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/_services/loading.service';
import { Auth } from 'src/app/_types/data-models';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { OtpFormComponent } from './otp-form/otp-form.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent  implements OnInit {

  authForm: FormGroup;
  auth: Auth = {};
  isLoginIn: boolean = false;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  otpSent:boolean = true;

  get f() {
    return this.authForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private dataStore: DataStoreService,
    private modalCtrl: ModalController
  ) {

    this.authForm = this.fb.group({
      phone: ['', Validators.required],
      idNumber: ["", [Validators.required]],
      emailAddress: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    });
   }

  ngOnInit() {}

  verifyID() {
    this.loader.loading = true;
    const {idNumber,phone,emailAddress} = this.authForm.value;
    this.auth.phoneNumber = phone?.e164Number.replace("+", "");
    this.auth.emailAddress = emailAddress;
    this.auth.idNumber = idNumber;
    this.dataStore.auth = this.auth;

     this.apiService
        .verifyID({
          nationalId: idNumber,
          idType: "NATIONAL.ID",
          phoneNumber:phone?.e164Number,
          emailAddress:emailAddress,
          userType:"SBGS",
          customerCategory:"SBGS"
        })
        .subscribe({
          next: (res) => {
            if (res.successful) {
              this.loader.loading = false;
              if(res.object.accountExistYN === 'Y'){
                this.toastr.success(res.object.message);
                this.auth.existsOnT24 = 'Y';
                this.otpSent = true;
                this.validateOtp();

              }
              else{
                this.auth.existsOnT24 = 'N';
                this.otpSent = true;
                this.validateOtp();
              }
            } else {
              this.loader.loading = false;
              this.toastr.error(res.message);
            }
          },
          error: (error) => {
            this.loader.loading = false;
            this.toastr.error("Request error try again.");
          }}
        );
    }

    async validateOtp(){
      const modal = await this.modalCtrl.create({
        component: OtpFormComponent,
        componentProps:{ auth: this.auth },
      });
      await modal.present();
    }

}
