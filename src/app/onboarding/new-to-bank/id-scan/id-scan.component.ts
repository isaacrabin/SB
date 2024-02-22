/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, IonicSafeString } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CameraComponent } from 'src/app/_components/camera/camera.component';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Identification } from 'src/app/_types/data-models';

@Component({
  selector: 'app-id-scan',
  templateUrl: './id-scan.component.html',
  styleUrls: ['./id-scan.component.scss'],
})
export class IdScanComponent  implements OnInit {
  currentModal = null;
  identification: Identification = {};
  side: any;
  accountToOpen: any;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private dataStore: DataStoreService,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private toastr: ToastrService,
    public loader: LoadingService,
  ) {
    this.accountToOpen = localStorage.getItem('account-to-open');
  }

  ngOnInit() {}

  scanImages() {
    switch (this.side) {
      case "id_front":
        this.loader.scanningFront = true;

        try {
          this.apiService
            .scanFrontID({
              national_id: this.identification.frontIdBase64,
            })
            .subscribe(
              (res) => {
                if (res.success) {
                  this.loader.scanningFront = false;
                  this.loader.scannedFront = true;
                  this.identification.frontIdOcrText = res.data;
                  this.router.navigate(["/onboarding/new/id-scan"], {
                    replaceUrl: true,
                  });
                } else {
                  this.loader.scanningFront = false;
                  this.loader.scannedFront = false;
                  this.scanningSolutions();
                }
              },
              (error) => {
                this.loader.scanningFront = false;
                this.loader.scannedFront = false;
                this.scanningSolutions();
              }
            ); // end api call
        } catch (error) {
          this.loader.scanningFront = false;
          this.loader.scannedFront = false;
          this.scanningSolutions();
        }

        break;
      case "id_back":
        if (this.loader.scannedFront) {
          this.loader.scanningBack = true;
          try {

            this.apiService
              .scanBackID({
                national_id: this.identification.backIdBase64,
                document_type: "ID",
              })
              .subscribe(
                (res) => {
                  if (res.success) {
                    this.loader.scanningBack = false;
                    const id = res.id.split(" ").join("");
                    // this.identification.nationalId = parseInt(id).toString(); //TODO looks like its truncating leading zero
                    this.identification.nationalId = id;
                    this.identification.ocrKey = res.key;
                    // Verify ID
                    this.verifyID(this.identification.nationalId);

                  } else {
                    this.loader.scanningBack = false;
                    this.scanningSolutions();
                  }
                },
                (error) => {
                  this.loader.scanningBack = false;
                  this.scanningSolutions();
                }
              ); // end api call
          } catch (error) {
            this.loader.scanningBack = false;
            this.scanningSolutions();
          }
        } else {
          this.toastr.error(
            "Please scan Front Of ID First",
            "Scanning Failed!"
          );
        }

        break;
      default:
        break;
    }
  }

   // Open Camera Modal
   async openCamera(side: string) {
    this.side = side;
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      cssClass: "my-custom-class",
      componentProps: { side },
    });


    modal.onWillDismiss().then(async (data: any) => {
      if (data.data.cancelled) {
      } else {
        this.identification = await data.data.data;
        await this.scanImages();

        //await this.uploadToRecognition(this.dataStore.identification.frontIdFile)
      }
    });
    return await modal.present();
    // this.router.navigate(['/onboarding/camera'], { queryParams: { side } });
  }

  // Save image
  async saveFrontImage(payload: any) {
    this.loader.savingFront = true;
    this.loader.scannedFront = false;

    try {
      this.apiService.saveImage(payload).subscribe(
        (res) => {
          if (res.successful) {
            this.loader.savingFront = false;
            this.loader.savedFront = true;
            this.dataStore.identification.frontSaved = true;
            this.router.navigate(["/onboarding/new/identification"], {
              replaceUrl: true,
            });
          } else {
            this.toastr.error(res.message);
            this.loader.savingFront = false;
            this.loader.savedFront = false;

            this.loader.savingBack = false;
            this.loader.savedBack = false;
          }
        },
        (error) => {
          this.toastr.error("Error saving image try again");
          this.loader.savingFront = false;
          this.loader.savedFront = false;

          this.loader.savingBack = false;
          this.loader.savedBack = false;
        }
      ); // end api call
    } catch (error) {
      this.toastr.error("Error saving image try again");
      this.loader.savingFront = false;
      this.loader.savedFront = false;

      this.loader.savingBack = false;
      this.loader.savedBack = false;
    }
  }
  async saveBackImage(payload: any) {
    this.loader.savingBack = true;

    try {
      this.apiService.saveImage(payload).subscribe(
        (res) => {
          if (res.successful) {
            this.loader.savingBack = false;
            this.loader.savedBack = true;
            this.dataStore.identification.backSaved = true;
            this.saveFrontImage({
              file: this.identification.frontIdFile,
              idType: "NATIONAL_ID",
              imageType: "ID_FRONT",
              match: this.identification.frontIdOcrText,
              nationalId: "",
            });
          } else {
            this.loader.savingBack = false;
            this.loader.savedBack = false;
            this.toastr.error(res.message);
          }
        },
        (error) => {
          this.loader.savingBack = false;
          this.loader.savedBack = false;
          this.toastr.error("Unable to save your document again");
        }
      ); // end api call
    } catch (error) {
      this.loader.savingBack = false;
      this.loader.savedBack = false;
      this.toastr.error("Unable to save your document again");
    }
  }

  // Verify that the ID scanned is for the user onboarding
  async verifyID(nationalId: any) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      mode:'ios',
      cssClass: "my-custom-class",
      header: "CONFIRM",
      subHeader: `${nationalId}`,
      message: `Please confirm that this is your National ID Number?
                Note: This number will be used to automatically fetch your KRA PIN
                `,
      htmlAttributes: {},
      buttons: [
        {
          text: "NO",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.loader.scanningBack = false;
          },
        },
        {
          text: "YES",
          handler: () => {
            // Save the front id
            this.saveBackImage({
              file: this.identification.backIdFile,
              idType: "NATIONAL_ID",
              imageType: "ID_BACK",
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

  async scanningSolutions() {
    const alert = await this.alertCtrl.create({
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
}
