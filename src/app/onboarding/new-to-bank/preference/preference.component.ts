/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Auth } from 'src/app/_types/data-models';
import { OtpFormComponent } from '../../auth/otp-form/otp-form.component';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Router } from '@angular/router';
import { SelectSeachComponent } from '../../../_components/select-seach/select-seach.component';


@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent  implements OnInit,AfterViewInit {


  dataForm: FormGroup;
  nextKinForm: FormGroup

  auth: Auth = {};
  isLoginIn: boolean = false;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  otpSent:boolean = true;
  submitAttempt: boolean = false;
  branches: any;
  countries = [];
  relationships = [];
  fatca = false;
  phoneNumberOfnextOfKinFlag = false;
  customActionSheetOptions: any = {
    header: "",
  };

  showDebitCard = true;
  isRedirectFromBusiness = false


  uniqueUId: string = '';
  disposalMethod: string = '';
  createSBKAccount: boolean = false;

  taxExemptFalse: string = '';
  taxExemptTrue: string = '';

  taxExemptNo: boolean = false;
  taxExemptYes: boolean = false;
  disposalMethodWallet: boolean = false;
  disposalMethodBank: boolean = false;
  residence: any = null;

  accountOption:any = null;

  get f() {
    return this.dataForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private dataStore: DataStoreService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {

    this.dataForm = this.fb.group({
      residence: ['', Validators.required],
      town:['', [Validators.required]],
      street: ['',[ Validators.required]],
      building: ["", [Validators.required]],
      rmCode: [""],
      usPostalCode: [""],
      usSocialSecurityNumber:[""],
      usMailingAddress: [""],
      mpesaNumber:[""],
      disposalMethod:[""],
      branch:[""],
      nokPhone:[""],
      nokEmail:[""],
      nokName:[""]
    });

    this.nextKinForm = this.fb.group({

    })

    this.accountOption = sessionStorage.getItem('fixedIsSelected');

    const preferencesFromLocalStorage = localStorage.getItem("preferences");
    const nextOfKinFromLocalStorage = localStorage.getItem("nextofkin");
    this.dataStore.preferences = preferencesFromLocalStorage ? { ...JSON.parse(preferencesFromLocalStorage) } : {};
    this.dataStore.preferences = nextOfKinFromLocalStorage ? { ...this.dataStore.preferences, ...JSON.parse(nextOfKinFromLocalStorage) } : {};



    const authStorage = localStorage.getItem("auth");
    this.auth = authStorage ? JSON.parse(authStorage) : {};

    const relationShipList = localStorage.getItem("relationShipList");
    this.relationships = relationShipList ? JSON.parse(relationShipList) : [];

    const branchesList = localStorage.getItem("branches");
    this.branches = branchesList ? JSON.parse(branchesList) : [];

    const coutriesList = localStorage.getItem("countries");
    this.countries = coutriesList? JSON.parse(coutriesList) : [];

   }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value.countryCode === "US") {
      this.fatca = true;
    } else {
      this.fatca = false;
    }
  }

  toggleExempt(val: any){
    if(val=== 'YES'){
      this.taxExemptTrue = 'success';
      this.taxExemptFalse = '';
      this.taxExemptYes = true;
      this.taxExemptNo = false;
    }
    else{
      this.taxExemptTrue = '';
      this.taxExemptFalse = 'success';
      this.taxExemptYes = false;
      this.taxExemptNo = true;
    }
  }


  async disposalChange(value: any){
    if(value === 'BANK') {
      this.disposalMethodWallet = false;
      this.disposalMethodBank = true;
    }
    else{
      this.disposalMethodWallet = true;
      this.disposalMethodBank = false;
    }
  }


    formatSSN() {
      let val = this.dataForm.value.usSocialSecurityNumber.replace(
        /\D/g,
        ""
      );
      let newVal = "";

      if (val.length > 4) {
        this.dataForm.patchValue({ usSocialSecurityNumber: val });
      }
      if (val.length > 3 && val.length < 6) {
        newVal += val.substr(0, 3) + "-";
        val = val.substr(3);
      }
      if (val.length > 5) {
        newVal += val.substr(0, 3) + "-";
        newVal += val.substr(3, 2) + "-";
        val = val.substr(5);
      }
      newVal += val;
      this.dataForm.patchValue({ usSocialSecurityNumber: newVal });
    }

    submitPreferenceData(){
      this.loader.loading = true;
      const payload = {
          accountName: "",
          accountNumber: "",
          accountProduct: [
              "Fixed",
              "Deposit"
          ],
          bankName: "",
          branch: "5680KE",
          city: "sdfghj",
          clientSuffix: "sdfghj",
          country: "KE",
          dividendDisposal: "ertyu",
          iBANNumber: "dfgh",
          passportYn: "N",
          postCode: "dsfghj",
          postalAddress: "sdfghjk",
          swiftCode: "",
          taxBracket: "sdfghj",
          usResidentYn: "yes",
          investorCategory:"LI",
          bornusYn:"Y",
          relationshipWithNextOfKin:"MOTHER",
          nameOfNextofKin:"ISAAC",
          phoneNumberOfnextOfKin:"0797899333",
          phoneNumber:"0797793444"
        }
        this.apiService.savePreferences(payload).subscribe({
          next:(res) => {
            this.loader.loading = false;
            switch(res.successful){
              case true:
                this.toastr.success(res.message);
                this.router.navigate(['/onboarding/new/occupation']);
                break;

              case false:
                this.toastr.success(res.message);
                this.router.navigate(['/onboarding/new/occupation']);
                break;

              default:
                break;
            }
          },
          error:(err) => {
            this.loader.loading = false;
            this.toastr.error(err);
          }
        })
    }

}
