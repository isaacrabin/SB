/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CameraComponent } from 'src/app/_components/camera/camera.component';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { Selfie } from 'src/app/_types/data-models';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



@Component({
  selector: 'app-liveness',
  templateUrl: './liveness.component.html',
  styleUrls: ['./liveness.component.scss'],
})
export class LivenessComponent  implements OnInit {

  url: string = '';
  selfie: Selfie = {};
  imageSource: any;

  constructor(
    private modalCtrl: ModalController,
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private dataStore: DataStoreService,
    private cookieService: CookieService,
    public loader: LoadingService,
    )
    {
    this.url = "https://wanpas.ai/mikayi/check_liveness";
   }

  ngOnInit() {}

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType:CameraResultType.Base64,
      source: CameraSource.Camera,
    })
    this.imageSource = 'data:image/jpeg:base64,'+ image.base64String

    this.dataStore.selfie.selfieBase64 = image.base64String;
    this.dataStore.selfie.selfieFile = await this.dataUrlToFile(
      this.dataStore.selfie.selfieBase64
    );
    this.uploadToRecognition(this.dataStore.selfie.selfieFile);
  }


  async openCamera(side: string) {
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      cssClass: "my-custom-class",
      componentProps: { side },
    });

    modal.onWillDismiss().then((data: any) => {
      if (data.data.cancelled) {
      } else {
        this.selfie = data.data.data ;
        this.uploadToRecognition(this.selfie.selfieFile);
      }
    });
    return await modal.present();
  }

  // Save Selfie
  saveSelfie(payload: any) {
    this.loader.loading = true;
    this.loader.savingSelfie = true;
        this.apiService.saveSelfie(payload).subscribe({
          next: (res: any) => {
             if (res.successful) {
              this.loader.loading = false;
              this.loader.savingSelfie = false;
              this.toastr.success(res.message);
              this.router.navigate(["/onboarding/summary"]);
            }
            else{
              this.loader.loading = false;
              this.loader.savingSelfie = false;
              this.toastr.warning("Error saving selfie try again");
            }
          },
          error: (err: any) => {
            this.loader.loading = false;
            this.loader.savingSelfie = false;
            this.toastr.warning("Error saving selfie try again");
          }
        }
       );
    }


  uploadToRecognition(file: any) {
    this.loader.detectingFace = true;
    this.loader.loading = true;
    const formData = new FormData();
    formData.append("key", file);  // giktek server
    try {
      this.httpClient
        .post<any>(this.url, formData)
        .subscribe(
          (res) => {
            if (res.error) {
              this.loader.detectingFace = false;
              this.loader.loading = false;

              let error_message = "";
              switch (res.error_code) {
                case "FACE_IS_OCCLUDED":
                  error_message =
                    "It's difficult to see your face. Be in a well lit room with no background lighting and your face  uncovered";
                  break;
                case "FACE_NOT_FOUND":
                  error_message =
                    "Move closer to your phone, be in a well lit room with no background lighting";
                  break;
                case "FACE_TOO_SMALL":
                  error_message =
                    "Move closer to your phone, be in a well lit room with no background lighting";
                  break;
                case "FACE_ANGLE_TOO_LARGE":
                  error_message =
                    "Move closer to your phone, be in a well lit room with no background lighting";
                  break;
                case "INVALID_FUSE_MODE":
                  error_message = "System error try again later";
                  break;
                case "LICENSE_ERROR":
                  error_message = "System error try again later";
                  break;

                default:
                  error_message = "Kindly take a better selfie";
                  break;
              }

              this.toastr.error(error_message);
            }

            if (res.probability > 0.49) {
              this.toastr.success("This is a live photo");
              this.loader.detectingFace = false;

              this.saveSelfie({ file: this.dataStore.selfie.selfieFile});
            }

            if (res.probability < 0.5) {
              this.toastr.error("This is not a live photo");
              this.loader.detectingFace = false;
              this.loader.loading = false;
            }


          },
          (err) => {
            this.toastr.error("Error processing image try again");
            this.loader.detectingFace = false;
            this.loader.loading = false;

          }
        ); // end of API call
    } catch (error) {
      this.toastr.error("Error processing image try again");
      this.loader.detectingFace = false;
      this.loader.loading = false;
    }
  }


  async dataUrlToFile(base64: any) {
    const res: Response = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob: Blob = await res.blob();
    return new File([blob], 'filename.jpeg', { type: 'image/jpeg' });
  }


}
