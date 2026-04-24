import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/authService';
import { UtilisateurService } from '../../services/utilisateurService';

/*
différents rôles
        UTILISATEUR
        BIBLIOTHECAIRE
        ADMINISTRATEUR
 */


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private authService: AuthService, private utilisateurService: UtilisateurService) {}

  onMenuBurger(): void {
    const menu = document.querySelector('.mobile-menu');
    menu?.classList.toggle('hidden');
  }

  estConnecte(): boolean {
    return this.authService.estConnecte();
  }

  deconnexion(): void {
    this.authService.deconnexion();
  }

  roleUtilisateur() : string|null {
    return this.utilisateurService.getRole();
  }

}
