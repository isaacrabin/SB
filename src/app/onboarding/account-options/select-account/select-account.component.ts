/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, computed } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss'],
})
export class SelectAccountComponent  implements OnInit {

  constructor(
    public loader: LoadingService,
    private modalCtrl: ModalController,
    private storeService: DataStoreService
  ) { }

  ngOnInit() {}

  closeModal(){}

  selectProduct(){
    return computed(this.storeService.selectedProducts().push('Fixed Deposit'));
  }

}
