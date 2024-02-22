/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-select-seach',
  templateUrl: './select-seach.component.html',
  styleUrls: ['./select-seach.component.scss'],
  imports:[IonicModule, CommonModule]
})
export class SelectSeachComponent  implements OnInit {

  isOpen: boolean = false;
  selected = [];

  constructor() { }

  ngOnInit() {}

  public open(){
    this.isOpen = true;
  }

  cancel(){
    this.isOpen = false;
  }

  select(){

  }

}
