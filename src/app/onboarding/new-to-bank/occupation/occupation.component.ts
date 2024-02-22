/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { trimPayload } from 'src/app/_helpers/payload-trimmer';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Auth } from 'src/app/_types/data-models';
import { SourceOfInvestments } from "src/assets/data/data"

type SourceofInvestment = {
  name: string;
 }

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss'],
})
export class OccupationComponent  implements OnInit {


  dataForm: FormGroup;
  otherSourceOfIncome: boolean = false;
  auth: Auth = {};
  isLoginIn: boolean = false;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  otpSent:boolean = true;
  submitAttempt: boolean = false;
  branches: any;
  occupations = [];
  industries = [];
  employers: any[] = [];
  incomes = [];
  filteredIndustry = [];
  filteredEmployers = [];
  filteredIncomes = [];
  fatca = false;
  phoneNumberOfnextOfKinFlag = false;
  customActionSheetOptions: any = {
    header: "",
  };
  occupationForm: FormGroup | undefined;
  otherValid = false;
  showOther = false;
  uniqueUId = '';

  showDebitCard = true;
  isRedirectFromBusiness = false;



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

  handleInvestmentSourceChange(event: any){
    if(event.value.name === 'Other') {
      this.otherSourceOfIncome = true;
    }
    else{
      this.otherSourceOfIncome = false;
    }
  }

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
    private modalCtrl: ModalController
  ) {


    this.dataForm = this.fb.group({
      accountProduct: [""],
      dada: [""],
      dadaSegment: [""],
      employerName: ["", [Validators.required]],
      industry: ["", [Validators.required]],
      monthlyIncome: ["", [Validators.required]],
      occupation: ["", [Validators.required]],
      sourceofInvestment:["",[Validators.required]],
      otherSource: [
        "",
        [Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$")],
      ],
      otherDescription: [
        "",
        [Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$")],
      ],
    });

    this.accountOption = sessionStorage.getItem('fixedIsSelected');

    const preferencesFromLocalStorage = localStorage.getItem("preferences");
    const nextOfKinFromLocalStorage = localStorage.getItem("nextofkin");
    this.dataStore.preferences = preferencesFromLocalStorage ? { ...JSON.parse(preferencesFromLocalStorage) } : {};
    this.dataStore.preferences = nextOfKinFromLocalStorage ? { ...this.dataStore.preferences, ...JSON.parse(nextOfKinFromLocalStorage) } : {};



    const authStorage = localStorage.getItem("occupation");
    this.dataStore.occupation = authStorage ? JSON.parse(authStorage) : {};



    const industyList = localStorage.getItem("industries");
    this.industries = industyList? JSON.parse(industyList) : [];

    const occupationsList = localStorage.getItem("occupations");
    this.occupations = occupationsList? JSON.parse(occupationsList) : [];

    const incomeList = localStorage.getItem("incomes");
    this.incomes = incomeList? JSON.parse(incomeList) : [];

    this.sourceofInvestmentFunds = SourceOfInvestments;

  }

  ngOnInit() {
    this.capitalizeEmployers();
  }

  selectionChange(val: any, type: string) {
    switch (type) {
      case "occupation":
        this.filteredIndustry = this.industries.filter((value: any) => {
          return (
            value.occupationCode === this.f['occupation'].value.occupationCode
          );
        });
        this.f['industry'].patchValue("");
        break;
      case "employer":
        if (val.companyCode === "GS9999") {
          this.showOther = true;
          this.otherValid = false;
        } else {
          this.otherValid = true;
          this.showOther = false;
          this.f['otherDescription'].patchValue("");
        }
        break;
      default:
        break;
    }
  }

    // Validate Other Description
    validateOther(value: any): void {
      setTimeout(() => {
        if (value.trim()) {
          this.otherValid = true;
        } else {
          this.otherValid = false;
        }
      }, 200);
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

  capitalizeEmployers() {
    const employerList = localStorage.getItem("employers");
    const myEmployers = employerList ? JSON.parse(employerList) : [];

    myEmployers .forEach((element: any) => {
      const data = {
        companyId: element.companyId,
        // companyName: element.companyName.toUpperCase(),
        companyName: element.companyName,
        companyCode: element.companyCode,
      };
      this.employers.push(data);
    });
  }

  submitOccupationData(){
    this.loader.loading = true;
    if (this.dataForm.valid) {
      // Check if employer name is other and the description is provided before saving
      if (
        this.f['employerName'].value.companyCode === "GS9999" &&
        this.f['otherDescription'].value !== ""
      ) {
        this.saveOccupationData();
      } else if (this.f['employerName'].value.companyCode !== "GS9999") {
        this.saveOccupationData();
      } else {
        this.toastr.error("Employer Name is required");
      }
    }
  }

  async saveOccupationData() {
    this.loader.loading = true;
    const {employerName, industry,monthlyIncome,occupation,otherDescription,sourceofInvestment} = this.dataForm.value;
    console.log(this.dataForm.getRawValue());
     const payload = {
      employerName: employerName?.companyCode,
      industry: industry?.industryCode,
      monthlyIncome: monthlyIncome?.incomeRangeCode,
      occupation: occupation?.occupationCode,
      other: otherDescription? otherDescription:"0458",
      sourceOfInvestmentFund:sourceofInvestment?.name,
    };
    localStorage.setItem(
      "occupation",
      JSON.stringify(this.dataForm.getRawValue())
    );
      trimPayload(payload);
      this.apiService.saveOccupation(payload).subscribe(
        (res) => {
          if (res.successful) {
            this.loader.loading = false;
            this.dataStore.occupation = this.dataForm.getRawValue();
            this.router.navigate(["/onboarding/liveness"]);
          } else {
            this.loader.loading = false;
            this.toastr.error(res.message);
          }
        },
        (err) => {
          this.loader.loading = false;
          this.toastr.error(err);
        }
      );
  }

}
