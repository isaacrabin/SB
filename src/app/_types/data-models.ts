export interface Auth {
  accountType?: string;
  customerCategory?: string;
  emailAddress?: string;
  phoneNumber?: string;
  idNumber?: string;
  userType?: string;
  country?: string;
  existsOnT24?: string;
  multipleAccountsAllowed?: string;
  bundleCode?: string;
  name?: string;
  currency?: any;
  accountName?: string;
  existingYN?: string;
}

export interface Identification {
  documentType?: string;
  idType?: string;
  frontIdBase64?: string;
  frontIdFile?: File;
  frontIdOcrText?: string;
  ocrKey?: string;
  frontSaved?: boolean;
  backIdBase64?: string;
  backIdFile?: File;
  backSaved?: boolean;
  passportBase64?: string;
  passportFile?: File;
  passportSaved?: boolean;
  signatureBase64?: string;
  signatureFile?: File;
  signatureSaved?: boolean;
  nationalId?: string;
}

export interface Preferences {
  branch?: string;
  employeeIdentificationNumber?: string;
  nameOfNextofKin?: string;
  orderDebitCard?: string;
  phoneNumberOfnextOfKin?: string;
  physicalAddress?: string;
  promoCode?: string;
  relationshipWithNextOfKin?: string;
  residence?: string;
  systemTenantId?: string;
  usMailingAddress?: string;
  usPostalCode?: string;
  usSocialSecurityNumber?: string;
  wpfFormString?: string;
  accountBundle?: string;
}

export interface Occupation {
  accountProduct?: string;
  dada?: string;
  dadaSegment?: string;
  employerName?: string;
  industry?: string;
  monthlyIncome?: string;
  occupation?: string;
  otherDescription?: string;
}

export interface Selfie {
  selfieBase64?: string;
  selfieFile?: File;
}

export interface Child {
  certFile?: File;
  certBase64?: string;
  certificateIssueDate?: string;
  certificateNumber?: string;
  childName?: string;
  currency?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface JointPrincipal {
  memberType?: String;
  customerNumber?: String;
}
