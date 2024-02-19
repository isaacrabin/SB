// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const sbgs =  'https://uat-onboarding.stanbicbank.co.ke/rest/sbgs-onboarding/api/v1/';
const devOcr = 'https://uat-onboarding.stanbicbank.co.ke/';
const imageUrl = "https://uat-onboarding.stanbicbank.co.ke/rest/sms-mcs/image/getImage/";
const dev = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/v1/';


export const environment = {
  production: false,
  sbgsUrl:sbgs,
  devOcr:devOcr,
  imageUrl: imageUrl,
  baseUrl: dev


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
