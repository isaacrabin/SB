/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent  implements OnInit,AfterViewChecked {

  summary: any;
  auth: any;
  fetchSummary = false;

  constructor(
    private dataStore: DataStoreService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router,
    public loader: LoadingService,
  ) { }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (!this.fetchSummary) {
      this.getSummary();

      this.fetchSummary = true;
    }
  }



  getSummary() {
    try {
      this.apiService.getSummary().subscribe(
        (res) => {
          this.fetchSummary = true;

          if (res.successful) {
            this.summary = res.object;
            console.log(this.summary);

            this.dataStore.jointPrincipal.customerNumber =
              this.summary.customerNumber;
            this.dataStore.jointPrincipal.memberType = "PRINCIPAL";
          }
        },
        (error) => {
          this.fetchSummary = true;
        }
      );
    } catch (error) {
      this.fetchSummary = true;
    }
  }

  createAccount() {
    this.cleanEditLocalStorage();
    switch (this.summary.accountCode) {
      case "1002":
        switch (this.summary.multipleAccountsFlag) {
          case "Y":
            this.jointAcc();
            break;
          case "N":
            this.pureSave();
            break;
          default:
            break;
        }
        break;
      case "1003":
        this.pureSave();
        break;
      case "6002":
        this.childAcc();
        break;
      default:
        break;
    }
  }


  /** make flag on local storage to return the user back to this page  */
  editSection(selection: String) {
    switch (selection) {
      case "IDENTIFICATION": // no need for flag .. page has resume capability
        this.fetchSummary = false;
        this.router.navigateByUrl("/onboarding/auth", { replaceUrl: false });
        break;
      case "ACCOUNT PREFERENCES":
        this.fetchSummary = false;
        this.router
          .navigateByUrl("/onboarding/preferences", { replaceUrl: false })
          .then(() => {
            localStorage.setItem(
              "summary_edit_flag",
              "/onboarding/preferences"
            );
          });

        break;
      case "NEXT OF KIN":
        this.fetchSummary = false;
        this.router
          .navigateByUrl("/onboarding/preferences", { replaceUrl: false })
          .then(() => {
            localStorage.setItem(
              "summary_edit_flag",
              "/onboarding/preferences"
            );
          });

        break;
      case "OCCUPATION":
        this.fetchSummary = false;
        this.router
          .navigateByUrl("/onboarding/occupation", { replaceUrl: false })
          .then(() => {
            localStorage.setItem("summary_edit_flag", "/onboarding/occupation");
          });

        break;
    }
  }

  cleanEditLocalStorage() {
    this.fetchSummary = false;
    localStorage.removeItem("summary_edit_flag");
  }

  pureSave() {
    if (this.auth.customerCategory === "Invited") {
      this.loader.loading = true;

      try {
        this.apiService.triggerJointAccount().subscribe(
          (result: any) => {
            this.loader.loading = false;

            if (result.successful) {
              this.router.navigate(["/onboarding/complete"], {
                queryParams: { success: true },
              });
            } else {
              this.toastr.show("Error creating joint account");
            }
          },
          (error) => {
            this.loader.loading = false;
            this.toastr.show("Error creating joint account");
          }
        );
      } catch (error) {
        this.loader.loading = false;
        this.toastr.show("Error creating joint account");
      }
    } else {
      this.loader.loading = true;

      try {
        this.apiService.createAccount().subscribe(
          (res) => {
            if (res.successful) {
              this.loader.loading = false;
              this.router.navigate(["/onboarding/complete"], {
                queryParams: { success: res.successful },
              });
            } else {
              this.router.navigate(["/onboarding/complete"], {
                queryParams: { success: res.successful },
              });
            }
          },
          (error) => {
            this.loader.loading = false;
          }
        );
      } catch (error) {
        this.loader.loading = false;
      }
    }
  }

  async jointAcc() {
    if (this.dataStore.auth.customerCategory === "Invited") {
      this.pureSave();
    } else {
      const accountMember = {
        custNumber: this.summary.customerNumber,
        name: this.summary.name,
        idNumber: this.summary.nationalId,
        selected: false,
        email: this.summary.emailAddress,
        phoneNumber: this.summary.phoneNumber,
      };
      if (this.dataStore.joint.accountMembers.length > 0) {
        this.router.navigate(["/onboarding/invitations"]);
      } else {
        // this.dataStore.joint.accountMembers.push(accountMember);
        this.router.navigate(["/onboarding/invitations"]);
      }
    }
  }

  childAcc() {
    this.router.navigate(["/onboarding/child"]);
  }


}
