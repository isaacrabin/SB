/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent  implements OnInit {

  options: AnimationOptions = {
    path: 'assets/lottie/check-okey-done.json'
 };

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private dataStore: DataStoreService,
  ) { }

  ngOnInit() {}

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }


  done() {
    this.cookieService.deleteAll();
    this.dataStore.auth = {};
    this.dataStore.preferences = {};
    localStorage.removeItem('auth');
    localStorage.removeItem('preferences');
    localStorage.removeItem('nextofkin');
    localStorage.removeItem('occupation');
    localStorage.removeItem('accountTypes');
    this.router.navigate(['/'], { replaceUrl: true });
  }

}
