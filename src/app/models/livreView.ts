import {Auteur} from './auteur';
import {Etat} from './etat';
import {Genre} from './genre';

export interface LivreView {
  id: number;
  titre: string;
  isbn: string;
  auteurs: Auteur[];
  genres: Genre[];
  etat: Etat;
  synopsis: string;
  idEmpruntActif: number;
  idEmprunteur: number;
  urlImage: string;
  dateDeParution: string;
}
