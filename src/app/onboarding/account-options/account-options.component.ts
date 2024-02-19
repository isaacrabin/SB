/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { register } from 'swiper/element/bundle';


import { SwiperContainer } from 'swiper/element/bundle';
import { SelectAccountComponent } from './select-account/select-account.component';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-account-options',
  templateUrl: './account-options.component.html',
  styleUrls: ['./account-options.component.scss'],
  animations: [
    trigger('swipeAnimation', [
      state('default', style({
        width: '100px' // Initial width
      })),
      state('swiped', style({
        width: '50px' // Width after swiping
      })),
      transition('default <=> swiped', [
        animate('0.3s')
      ])
    ])
  ]

})
export class AccountOptionsComponent  implements OnInit {

  @ViewChild('#modal') modal: ElementRef | undefined;
  openModal: boolean = false;

  selectedProds: number = 0;
  swipeState = 'default';


  slides: Array<{ title: string, subtitle: string, icon?: string,logo?: string,desc: string }> = [
    {
      title: 'Equity (CDS Account)',
      subtitle: "Best Acccount for your needs",
      desc: "The best acccount for your needs",
      logo:'logo'
    },
    {
      title: 'Fixed Income/Bonds (CBKCDS Account)',
      subtitle: "Best Acccount for your needs",
      desc: "The best acccount for your needs",
      icon: 'self_ac'
    },
  ]

  swiperOptions = {
    centeredSlides: true,
    slidesPerView: 'auto',
    scrollbars: true,
    spaceBetween: 10, // Adjust as needed
    loop: true, // Enable loop mode if needed
    // Other Swiper options
  };

  constructor(
    public loader: LoadingService,
    private modalCtrl: ModalController,
    private storeService: DataStoreService
  ) {
    register();


   }

  ngOnInit() {}

  logIndex(i: number){

  }

  swipeLeft() {
    this.swipeState = 'swiped';
  }

  swipeRight() {
    this.swipeState = 'default';
  }

  async moveTo() {
    const modal = await this.modalCtrl.create({
      component: SelectAccountComponent,
      componentProps:{ },
      breakpoints:[0.5, 0.8],
      initialBreakpoint:0.8
    });
    await modal.present();
  }

  closeModal(){

  }

}
