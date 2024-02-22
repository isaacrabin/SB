import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JWTInterceptor } from './_helpers/jwt.interceptor';
import { TokenInterceptor } from './_helpers/token-grabber.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './_services/api.service';
import { provideLottieOptions } from 'ngx-lottie';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,BrowserAnimationsModule,HttpClientModule,ToastrModule.forRoot(), IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    CookieService,
    ApiService,
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
