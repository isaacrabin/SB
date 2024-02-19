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

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
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
