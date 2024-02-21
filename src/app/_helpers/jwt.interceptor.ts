import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as aesjs from 'aes-js';
import base64url from 'base64url';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('access-token');
    if (!token) {
      return next.handle(req);
    }

    try {
      token = this.encrypt(token);
    } catch (error) {
      console.error('Encryption failed:', error);
      return throwError('Encryption failed');
    }

    const req1 = req.clone({
      setHeaders: { Authorization: `${token}` },
    });

    return next.handle(req1).pipe(
      catchError((error) => {
        console.error('Request failed:', error);
        return throwError('Request failed');
      })
    );
  }

  encrypt(msg: string): string {
    const key = '$EM8-NAYA?>#9xd2';
    const iv = 'B0l!nG-4L6TXSwB5';

    const keyBytes = aesjs.utils.utf8.toBytes(key);
    const ivBytes = aesjs.utils.utf8.toBytes(iv);

    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    const textBytes = aesjs.utils.utf8.toBytes(msg);
    const padded = aesjs.padding.pkcs7.pad(textBytes);
    const encryptedBytes = aesCbc.encrypt(padded);

    // Convert Uint8Array to Buffer
    const encryptedBuffer = Buffer.from(encryptedBytes);

    return base64url.encode(encryptedBuffer);
  }

  decrypt(msg: string) {
    const key = '$EM8-NAYA?>#9xd2';
    const iv = 'B0l!nG-4L6TXSwB5';

    // Convert base64url encoded string back to Buffer
    const encryptedBuffer = Buffer.from(base64url.decode(msg));

    // Initialize AES-CBC mode with the key and IV
    const keyBytes = aesjs.utils.utf8.toBytes(key);
    const ivBytes = aesjs.utils.utf8.toBytes(iv);
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);

    // Decrypt the encrypted bytes
    const decryptedBytes = aesCbc.decrypt(encryptedBuffer);

    // Remove padding
    const decryptedText = aesjs.utils.utf8.fromBytes(aesjs.padding.pkcs7.strip(decryptedBytes));

    return decryptedText;
}
}
