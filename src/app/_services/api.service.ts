import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  sbgUrl = environment.sbgsUrl;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Get Account Types
  getAccountTypes(): Observable<any> {
    return this.http.get(this.sbgUrl + 'accountType');
  }


  // Auth service
  login(payload: any): Observable<any> {
    const header1= {'Content-Type':'application/json',};
    return this.http.post(this.baseUrl + 'auth', payload,{
      headers: header1,
      observe: 'response',
      responseType: 'json'
  });
  }

  // Verify OTP
  verifyOTP(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'otp', payload);
  }

  // Verify OTP
  verifyID(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'auth', payload);
  }


  validateCDSAccount(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account-check/cv-account-validation', payload);
  }

  // Scan Front ID
  scanFrontID(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.devOcr}frontid`, payload);
  }

  // Scan Back ID / Passport
  scanBackID(payload: any): Observable<any> {
    return this.http.post(`${environment.devOcr}ocr`, payload);
  }

  // Save Images
  saveImage(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.sbgUrl + 'image', formData);
  }





  // Save Preferences
  savePreferences(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'preferences/sbgs-preference', payload);
  }

  // Get branches
  getBranches(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/branch');
  }

  // Get countries
  getCountries(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/country');
  }

  // Get employers
  getEmployers(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/employer');
  }

  // Get industries
  getIndustries(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/industry');
  }

  // Get occupations
  getOccupations(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/occupation');
  }

  // Get occupations
  getRelationships(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/relation');
  }

  // Get Incomes
  getIncomes(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/income');
  }

  // Get currencies
  getCurrencies(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/currency');
  }

  // Save Occupation
  saveOccupation(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'occupation/sbgs-occupation', payload);
  }

  // Save Existing to bank Preferences
  saveExistingToBankPreference(payload: any): Observable<any> {
    return this.http.post(this.sbgUrl + 'preferences/existing-tobank-preference', payload);
  }



  // Save Selfie
  saveSelfie(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.baseUrl + 'selfie', formData);
  }

  // Create Account
  createAccount(): Observable<any> {
    return this.http.post(this.baseUrl + 'confirmation', {});
  }

  // Create Joint Account
  triggerJointAccount(): Observable<any> {

    return this.http.post(this.baseUrl + 'joint/invited', {});

  }

  // Create a child account
  createChild(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.baseUrl + 'child', formData);
  }

  // create joint account
  createJointAcc(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'joint', payload);
  }

  // Get Joint Account Inviter Details
  getJointAccountInviter(): Observable<any> {
    return this.http.get(this.baseUrl + 'joint');
  }

  // Get Summary of user account
  getSummary(): Observable<any> {
    return this.http.get(this.baseUrl + 'selfie');
  }

  // Notification account details
  getReminderDetails(): Observable<any> {
    return this.http.get(this.baseUrl + 'reminder');
  }








}
