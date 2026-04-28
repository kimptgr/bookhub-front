import {Injectable, signal} from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {UserDTO} from '../models/userDTO';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';

// Interface qui représente le contenu du token d'un utilisateur
interface JwtPayload {
  sub: string;   // email
  id: number;
  role: string;  // rôle format : UTilisateur, Bibliothecaire, Admin
  exp: number;   // date d'expiration
}


@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private readonly BASE_URL = environment.base_url;
  private _users= signal<UserDTO[] |null >(null);
  users = this._users.asReadonly();
  constructor(private http: HttpClient) {
  }

  getPayload(): JwtPayload | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  getId(): number | null {
    return this.getPayload()?.id ?? null;
  }

  loadUsers(): void {
    this.http.get<UserDTO[]>(this.BASE_URL + "/utilisateurs").pipe(
      tap(us => {
        this._users.set(us)
      })
    ).subscribe()
  }


}
