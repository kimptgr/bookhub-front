import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

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




}
