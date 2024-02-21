import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  Auth,
  Child,
  Identification,
  JointPrincipal,
  Occupation,
  Preferences,
  Selfie,
} from '../_types/data-models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {

  public selectedAccountProducts = new BehaviorSubject<any[]>([]);
  public selectedAccountProductsCount = new BehaviorSubject<number>(0);

  get selectedAccountProducts$(){
    return this.selectedAccountProducts.asObservable();
  }

  get selectedAccountProductsCount$(){
    return this.selectedAccountProductsCount.asObservable();
  }

  addAccountProduct(product: any){
    const currentValue = this.selectedAccountProducts.value;
    const updatedValue = [...currentValue, product];
    this.selectedAccountProducts.next(updatedValue);
    this.selectedAccountProductsCount.next(updatedValue.length);
  }

  public selectedProducts: any = signal([]);

  constructor(private http: HttpClient) {}

  public auth: Auth = {};

  public identification: Identification = {};

  public preferences: Preferences = {};

  public occupation: Occupation = {};

  public selfie: Selfie = {};

  public summary: any = {};

  public branches = [];

  public countries = [];

  public relationships = [];

  public occupations = [];

  public industries = [];

  public employers = [];

  public incomes = [];

  public joint = {
    accountMembers: [],
  };

  public jointPrincipal: JointPrincipal = {}

  public child: Child = {};
}
