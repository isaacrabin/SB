/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Auth, Identification } from 'src/app/_types/data-models';
import { OtpFormComponent } from '../../auth/otp-form/otp-form.component';
import { CameraComponent } from 'src/app/_components/camera/camera.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-identfication',
  templateUrl: './identfication.component.html',
  styleUrls: ['./identfication.component.scss'],
})
export class IdentficationComponent  implements OnInit {


  authForm: FormGroup;
  auth: Auth = {};
  documentType = "NATIONAL_ID";
  identification: Identification = {};
  router = inject(Router);

  get f() {
    return this.authForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private dataStore: DataStoreService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
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


  async presentModal(side: string) {
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      cssClass: "my-custom-class",
      componentProps: { side },
    });
    modal.onWillDismiss().then((data: any) => {
      if (data.data.cancelled) {
      } else {
        if (side === "passport") {
          this.identification = data.data.data;
          this.scanPassport();
        } else if (side === "signature") {
          this.identification = data.data.data;
          if (this.dataStore.identification.nationalId) {
            this.saveImage("signature", {
              file: this.identification.signatureFile,
              idType: "",
              imageType: "SIGNATURE",
              match: "",
              nationalId: "",
            });
          } else {
            this.toastr.info("Scan Document Type First");
          }
        } else {
        }
      }
    });
    return await modal.present();
  }

  selectDocType(type: string) {
    switch (type) {
      case "ID":
        this.dataStore.identification.documentType = this.documentType;
        this.router.navigate(["/onboarding/new-to-bank/id-scan"]);
        break;
      case "PASSPORT":
        this.dataStore.identification.documentType = this.documentType;
        this.presentModal("passport");
        break;
      case "SIGNATURE":
        this.dataStore.identification.documentType = this.documentType;
        this.presentModal("signature");
        break;
      default:
        break;
    }
  }


  // Save image
  async saveImage(side: any, payload: any) {
    switch (side) {
      case "passport":
        this.loader.savingPassport = true;

        try {
          this.apiService.saveImage(payload).subscribe(
            (res) => {
              if (res.successful) {
                this.loader.savingPassport = false;
                this.loader.savedPassport = true;
              } else {
                this.loader.savingPassport = false;
                this.toastr.error(res.message);
              }
            },
            (error) => {
              this.loader.savingPassport = false;
              this.toastr.error("Error saving passport try again.");
            }
          ); // end api call
        } catch (error) {
          this.loader.savingPassport = false;
          this.toastr.error("Error saving passport try again.");
        }

        break;
      case "signature":
        this.loader.savingSignature = true;

        try {
          this.apiService.saveImage(payload).subscribe(
            (res) => {
              if (res.successful) {
                this.loader.savingSignature = false;
                this.loader.savedSignature = true;
                this.dataStore.identification.backSaved = true;
              } else {
                this.loader.savingSignature = false;
                this.toastr.error(res.message);
              }
            },
            (error) => {
              this.loader.savingSignature = false;
              this.toastr.error("Error saving signature try again.");
            }
          ); // end api call
        } catch (error) {
          this.loader.savingSignature = false;
          this.toastr.error("Error saving signature try again.");
        }

        break;
      default:
        break;
    }
  }


  // Scan Passport
  scanPassport() {
    this.loader.scanningPassport = true;

    try {
      this.apiService
        .scanBackID({
          national_id: this.identification.passportBase64,
          document_type: "PASSPORT",
        })
        .subscribe(
          (res) => {
            if (res.success) {
              this.loader.scanningPassport = false;
              const id = res.id.split(" ").join("");
              this.identification.nationalId = id;
              this.identification.ocrKey = res.key;
              // Verify that the passport is correct
              this.verifyPassport(this.identification.nationalId);
            } else {
              this.loader.scanningPassport = false;
              this.scanningSolutions();
            }
          },
          (error) => {
            this.loader.scanningPassport = false;
            this.scanningSolutions();
          }
        ); // end api call
    } catch (error) {
      this.loader.scanningPassport = false;
      this.scanningSolutions();
    }
  }


  async scanningSolutions() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: "my-custom-class",
      mode:'md',
      header: "SCANNING FAILED",
      subHeader:'Take note of the following concerns as your make another scanning attempt',
      message: `- Ensure you are scanning the correct side of the ID. \n\n
                - Ensure your ID fits into the box guideline of the camera.\n\n
                - Ensure you are scanning in a well lit room. i.e Avoid dark areas.\n\n
                `,
      buttons: [
        {
          text: "OK",
          handler: () => {
            // Save the front id
          },
        },
      ],
    });
    await alert.present();
  }



  // Verify that the Passport scanned is for the user onboarding
  async verifyPassport(passportNumber: any) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: "my-custom-class",
      mode:'ios',
      htmlAttributes:{},
      subHeader: `${passportNumber}`,
      header: `CONFIRM`,
      message: `Please confirm that this is your Passport Number?`,
      buttons: [
        {
          text: "NO",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.loader.scanningPassport = false;
          },
        },
        {
          text: "YES",
          handler: () => {
            // Save the front id
            this.saveImage("passport", {
              file: this.identification.passportFile,
              idType: "PASSPORT_ID",
              imageType: "PASSPORT",
              match: "",
              nationalId: this.identification.nationalId,
              key: this.identification.ocrKey,
            });
          },
        },
      ],
    });
    await alert.present();
  }


    // On Document Type Change
    onDocumentTypeChange(value: any) {
      this.identification.backSaved = false;
      this.identification.frontSaved = false;
      this.dataStore.identification.frontSaved = false;
      this.dataStore.identification.backSaved = false;
      this.loader.savedPassport = false;
      this.loader.savedSignature = false;
    }

    proceedToPreferences() {
      this.dataStore.identification.documentType = this.documentType;
      this.router.navigate(["/onboarding/new-to-bank/preferences"]);
    }


}
