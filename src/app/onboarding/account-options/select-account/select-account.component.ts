/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit, computed } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss'],
})
export class SelectAccountComponent  implements OnInit {

  @Input() product: any;

  subscription: Subscription | undefined;
  dataArray: Array<any> = [];

  selectedAccountProducts$ = this.storeService.selectedAccountProducts$;

  constructor(
    public loader: LoadingService,
    private modalCtrl: ModalController,
    private storeService: DataStoreService
  ) { }

  ngOnInit() {
    // console.log(this.product)
  }

  closeModal(){}

  selectProduct(val: any){

   this.subscription = this.storeService.selectedAccountProducts$.subscribe(value => {
      this.dataArray = value;
      const exists= this.dataArray.includes(val);
      if(!exists){
        this.storeService.addAccountProduct(val);
        this.modalCtrl.dismiss();
      }
      else{
        // console.log('Exists', val);
        this.modalCtrl.dismiss();
      }

    });

    // return computed(this.storeService.selectedProducts().push('Fixed Deposit'));
  }

}
