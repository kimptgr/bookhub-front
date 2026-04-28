import { Routes } from '@angular/router';
import {Nouveau} from './livres/component/nouveau/nouveau';
import {Catalogue} from './livres/component/catalogue/catalogue';
import { Connexion } from './pages/connexion/connexion';
import { Inscription } from './pages/inscription/inscription';
import {Details} from './livres/component/details/details';
import {authenticatedGuard} from './guards/authenticated-guard';
import {librarianGuard} from './guards/librarian-guard';
import {adminGuard} from './guards/admin-guard';
import {Modifier} from './livres/component/modifier/modifier';
import {Legalinfo} from './livres/component/legalinfo/legalinfo';
import {DashboardAdmin} from './dash-board-admin/dashboard-admin';
import {ProfilComponent} from './profil-component/profil-component';


export const routes: Routes = [
  { path: 'catalogue', component: Catalogue, canActivate: [authenticatedGuard] },
  { path: 'mentions-legales', component: Legalinfo },
  { path: 'livres/nouveau', component: Nouveau, canActivate: [authenticatedGuard, librarianGuard] },
  { path: 'livres/modifier/:id', component: Modifier, canActivate: [authenticatedGuard, librarianGuard] },
  { path: 'livres/:id', component: Details, canActivate: [authenticatedGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [authenticatedGuard] },
  { path: 'dashboard-admin', component: DashboardAdmin, canActivate: [authenticatedGuard, adminGuard]},
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: '**', redirectTo: '' }
];
