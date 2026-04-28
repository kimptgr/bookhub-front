import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {UtilisateurAdmin} from '../models/UtilisateurAdmin';
import {HttpClient} from '@angular/common/http';
import { Role } from '../models/enum/roles-enum';


@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private readonly BASE_URL = environment.base_url + `/dashboard/admin`;

  constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<UtilisateurAdmin[]> {
    return this.http.get<UtilisateurAdmin[]>(`${this.BASE_URL}/utilisateurs`);
  }

  modifierUtilisateur(id: number, role: Role, desactive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.BASE_URL}/utilisateurs/${id}`, { role, desactive });
  }

  modifierRolesEnMasse(updates: { id: number, role: Role }[]): Observable<void> {
    return this.http.patch<void>(`${this.BASE_URL}/utilisateurs/roles`, updates);
  }

}
