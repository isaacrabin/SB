/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent  implements OnInit {

  @Input() data: any;

  webcamElement: any;
  canvasElement: any;
  photoCanvas: any;
  canvasContext: any;
  imageSource: any;

  Height = window.outerHeight;
  Width = window.outerWidth;
  // RatioHeight = 0.32;
  // RationWidth = 0.025;
  // boxLength = 20;

  RatioHeight = 0.2;
  RationWidth = 0.025;
  boxLength = 25;

  title = 'Front Id';

  webcam: any;
  cameraError = false;
  cameraActive = false;

  accountToOpen: any;


    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string = '';
    public videoOptions: MediaTrackConstraints = {
      // width: {ideal: 1024},
      // height: {ideal: 976}
    };
    public errors: WebcamInitError[] = [];

    // latest snapshot
    public webcamImage: WebcamImage | undefined;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();






  @Input() side: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStore: DataStoreService,
    private modalCtrl: ModalController,
    private cookieService: CookieService,

  ) {
    this.accountToOpen = localStorage.getItem('account-to-open');
  }

  ngOnInit() {

    // WebcamUtil.getAvailableVideoInputs()
    // .then((mediaDevices: MediaDeviceInfo[]) => {
    //   this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    // });

  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType:CameraResultType.Base64,
      source: CameraSource.Camera,
    })
    this.imageSource = 'data:image/jpeg:base64,'+ image.base64String



    switch (this.side) {

      case 'id_front':
        this.dataStore.identification.frontIdBase64 = image.base64String;
        this.dataStore.identification.frontIdFile = await this.dataUrlToFile(
          this.dataStore.identification.frontIdBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.identification,
        });
        break;

      case 'id_back':
        this.dataStore.identification.backIdBase64 = image.base64String;
        this.dataStore.identification.backIdFile = await this.dataUrlToFile(
          this.dataStore.identification.backIdBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.identification,
        });
        break;

      case 'passport':
        this.dataStore.identification.passportBase64 = image.base64String;
        this.dataStore.identification.passportFile = await this.dataUrlToFile(
          this.dataStore.identification.passportBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.identification,
        });
        break;

      case 'signature':
        this.dataStore.identification.signatureBase64 = image.base64String;
        this.dataStore.identification.signatureFile = await this.dataUrlToFile(
          this.dataStore.identification.signatureBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.identification,
        });
        break;

      case 'selfie':
        this.dataStore.selfie.selfieBase64 = image.base64String;
        this.dataStore.selfie.selfieFile = await this.dataUrlToFile(
          this.dataStore.selfie.selfieBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.selfie,
        });
        break;

      case 'birth_cert':
        this.dataStore.child.certBase64 = image.base64String;
        this.dataStore.child.certFile = await this.dataUrlToFile(
          this.dataStore.child.certBase64
        );
        this.modalCtrl.dismiss({
          cancelled: false,
          data: this.dataStore.child,
        });
        break;

        case 'exemption':
          this.dataStore.identification.taxBase64 = image.base64String;
          this.dataStore.identification.taxFile = await this.dataUrlToFile(
            this.dataStore.identification.taxBase64
          );
          this.modalCtrl.dismiss({
            cancelled: false,
            data: this.dataStore.identification
          });
          break;
      default:
        break;
    }

  }

  captureDocument(): string {
    const scale = 1.3;
    const canvas = document.createElement('canvas');
    canvas.width = this.webcamElement.videoWidth * scale;
    canvas.height = this.webcamElement.videoHeight * scale;
    const canvasData = canvas.toDataURL('image/jpeg', 1.0);
    return canvasData.split('base64,')[1];
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  // Cancel Scanning
  dismiss() {
    this.modalCtrl.dismiss({
      cancelled: true,
    });
  }



  async dataUrlToFile(base64: any) {
    const res: Response = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob: Blob = await res.blob();
    return new File([blob], 'filename.jpeg', { type: 'image/jpeg' });
  }
}
