
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { register } from 'swiper/element/bundle';


import { SwiperContainer } from 'swiper/element/bundle';
import { SelectAccountComponent } from './select-account/select-account.component';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import SwiperComponent  from 'swiper';
import { Swiper, SwiperOptions } from 'swiper/types';
import {
  Navigation,
  Autoplay,
  Pagination,
  FreeMode,
} from 'swiper/modules';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-account-options',
  templateUrl: './account-options.component.html',
  styleUrls: ['./account-options.component.scss'],
  styles: [
    `
    swiper-slide {
      height: 400px !important;
    }
    // swiper-slide:nth-of-type(1) {
    //   background-color: red;
    // }
    // swiper-slide:nth-of-type(2) {
    //   background-color: green;
    // }
    // swiper-slide:nth-of-type(3) {
    //   background-color: blue;
    //   color: white;
    // }
    // swiper-slide:nth-of-type(4) {
    //   background-color: yellow;
    // }
  `,
  ],

})
export class AccountOptionsComponent  implements OnInit {


  dataValue: number = 0;
  dataArray: Array<any> = [];
  private subscription: Subscription;
  addedIndex: number = 0;


  selectedAccountProducts$ = this.storeService.selectedAccountProducts$;
  selectedAccountProductsCount$ = this.storeService.selectedAccountProductsCount$;

  @ViewChild('#modal') modal: ElementRef | undefined;
  openModal: boolean = false;
  selectedProds: number = 0;

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  segmentList: Array<string> = ['All', 'Breakfast', 'Main Dish', 'Drinks'];
  selectedSegment: string = this.segmentList[0];


  slides: Array<{ title: string, subtitle: string, icon?: string,logo?: string,desc: string }> = [
    {
      title: 'Equity (CDS Account)',
      subtitle: "Best Acccount for your needs",
      desc: "The best acccount for your needs",
      logo:'logo'
    },
    {
      title: 'Fixed Income/Bonds',
      subtitle: "Best Acccount for your needs",
      desc: "The best acccount for your needs",
      icon: 'self_ac'
    },
  ]

  swiperOptions: SwiperOptions = {
    centeredSlides: true,
    slidesPerGroup:3,
    slidesPerView: 'auto',
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination:false,
    slidesOffsetAfter: 20,
    navigation:{
      disabledClass: 'swiper-button-disabled',
      hiddenClass:'swiper-button-hidden'
    },
    flipEffect: {
      slideShadows: true,
    },
    zoom:true,
    scrollbar: true,
    spaceBetween: 10, // Adjust as needed
    loop: true, // Enable loop mode if needed
    // Other Swiper options
  };

  constructor(
    public loader: LoadingService,
    private modalCtrl: ModalController,
    private storeService: DataStoreService,
    private router: Router
  ) {
    register();

    this.subscription = this.storeService.selectedAccountProductsCount$.subscribe(value => {
      this.dataValue = value;
    });

    this.subscription = this.storeService.selectedAccountProducts$.subscribe(value => {
      this.dataArray = value;
    });

   }

  ngOnInit() {
    console.log(this.selectedAccountProductsCount$)
  }

  ngAfterViewInit(): void {
   }

  logIndex(i: number){

  }




  async moveTo(i: number, product: any) {
    this.addedIndex = i;
    const modal = await this.modalCtrl.create({
      component: SelectAccountComponent,
      componentProps:{
        product: product
      },
      breakpoints:[0.5, 0.8],
      initialBreakpoint:0.8
    });
    await modal.present();
  }

  slideDidChange() {
    console.log('Slide changed');
    // Additional logic for slide change
  }

  closeModal(){

  }

  proceed(){
    this.router.navigate(["/onboarding/new/identification"]);
  }


}
