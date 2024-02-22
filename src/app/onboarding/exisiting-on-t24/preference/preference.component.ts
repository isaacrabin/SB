/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Auth } from 'src/app/_types/data-models';
import { SourceOfInvestments } from "src/assets/data/data"


type SourceofInvestment = {
  name: string;
 }


@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent  implements OnInit {


  dataForm: FormGroup;
  nextKinForm: FormGroup

  auth: Auth = {};
  isLoginIn: boolean = false;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  otpSent:boolean = true;
  submitAttempt: boolean = false;
  otherSourceOfIncome: boolean = false;
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
  sourceofInvestmentFunds:  SourceofInvestment[];

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
    private alertCtrl: AlertController
  ) {

    this.dataForm = this.fb.group({
      mpesaNumber:[""],
      disposalMethod:[""],
      branch:[""],
      sourceofInvestment:["",[Validators.required]],
    });

    this.nextKinForm = this.fb.group({

    })

    this.sourceofInvestmentFunds = SourceOfInvestments;

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

  ngOnInit(){}

  handleInvestmentSourceChange(event: any){
    if(event.value.name === 'Other') {
      this.otherSourceOfIncome = true;
    }
    else{
      this.otherSourceOfIncome = false;
    }
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

    savePreference(){
      this.loader.loading = true;
      const {sourceofInvestment} = this.dataForm.value;
      const payload = {
          accountName: this.dataStore.auth?.accountName,
          accountNumber: "45678098765",
          swiftCode: "XXXX",
          getiBANNumber: "4567890",
          dividendDisposal: "Bank",
          phoneNumber: "",
          taxBracket: "",
          accountProduct: [
          "smart direct"
          ]
      }

      this.apiService.saveExistingToBankPreference(payload).subscribe({
        next:(resp) => {
          this.loader.loading = false;

        },
        error:(err) => {
          this.loader.loading = false;
        }
      })

    }


}
