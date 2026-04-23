import { Routes } from '@angular/router';
import {Nouveau} from './livres/component/nouveau/nouveau';
import { Connexion } from './pages/connexion/connexion';
import { Inscription } from './pages/inscription/inscription';
import {Details} from './livres/component/details/details';

export const routes: Routes = [
  { path: 'livres/nouveau', component: Nouveau },
  { path: 'livres/:id', component: Details },
  { path: '**', redirectTo: '' }
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' }
];
