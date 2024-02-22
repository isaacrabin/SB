/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-e-summary',
  templateUrl: './e-summary.component.html',
  styleUrls: ['./e-summary.component.scss'],
})
export class ESummaryComponent  implements OnInit {


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

  createAccount() {
      this.loader.loading = true;
        this.apiService.createAccount().subscribe({
          next:(res) =>{
            if (res.successful) {
              this.loader.loading = false;
              this.router.navigate(["/onboarding/success"], {
                queryParams: { success: res.successful },
              });
            } else {
              this.router.navigate(["/onboarding/success"], {
                queryParams: { success: res.successful },
              });
            }
          },
          error: (err) => {
            this.loader.loading = false;
            this.toastr.error(err);
          }
        }

        );


  }

}
