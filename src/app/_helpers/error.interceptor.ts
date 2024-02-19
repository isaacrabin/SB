import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadingService } from '../_services/loading.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  unauthorized = 401;
  /**
   * Indicates that the request is valid and the client is authenticated, but the client is not allowed access the page or
   * resource for any reason.
   * E.g sometimes the authorized client is not allowed to access the directory on the server.
   */
  forbidden = 403;
  /**
   * Indicates that the requested resource is not available now.
   */
  notFound = 404;
  /**
   * Indicates that the request by the client was not processed, as the server could not understand what the client
   * is asking for.
   */
  badRequest = 400;
  /**
   * The request could not be completed due to a conflict with the current state of the resource.
   * This code is only allowed in situations where it is expected that the user might be able to resolve the
   * conflict and resubmit the request.
   */
  existingRecord = 409;
  /**
   * Generic internal server error occurring
   */
  internalServerError = 500;
  /**
   * Constructor
   * @param::  authenticationService
   * @param:: toaster
   */
  constructor(
    private toaster: ToastrService,
    public loading: LoadingService,
    private router: Router
  ) {}
  /**
   * Interceptor
   * @param :: request
   * @param :: next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {

        // TODO: REMOVE THIS COMMENT 
       /* switch (err.status) {   
          case this.notFound:
            this.loading.loading = false;
            this.toaster.error('Not Found. Please try again later.');
            break;
          case this.unauthorized:
            this.loading.loading = false;
            this.router.navigate(['/auth']);
            this.toaster.error('Access denied.Please try again later');
            break;
          case this.badRequest:
            this.loading.loading = false;
            this.toaster.info(
              'There was an error processing your request.Please try again later'
            );
            break;
          case this.forbidden:
            this.loading.loading = false;
            this.toaster.info(
              'Access denied.Login again or contact the system adminsitrator for more info'
            );
            break;
          case this.internalServerError:
            this.loading.loading = false;
            this.toaster.info(
              'We are unable to connect to the system.Please try again later'
            );
            break;
          default:
            this.loading.loading = false;
            this.toaster.info(
              'We are unable to connect to the system.Please try again later'
            );
        }

        */

        return throwError(err);
      })
    );
  }
}
