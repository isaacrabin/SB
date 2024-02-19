/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-docs-required',
  templateUrl: './docs-required.component.html',
  styleUrls: ['./docs-required.component.scss'],
})
export class DocsRequiredComponent  implements OnInit {

  constructor(
    public loader: LoadingService,
    public dataStore: DataStoreService
  ) { }

  ngOnInit() {}

  proceed(){

  }

}
