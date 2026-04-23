import { Routes } from '@angular/router';
import {Nouveau} from './livres/component/nouveau/nouveau';
import {Details} from './livres/component/details/details';

export const routes: Routes = [
  { path: 'livres/nouveau', component: Nouveau },
  { path: 'livres/:id', component: Details },
  { path: '**', redirectTo: '' }
];
