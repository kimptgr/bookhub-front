import {Auteur} from './auteur';

export interface Livre {
  id: number;
  titre: string;
  isbn: string;
  auteurs: Auteur[];
  genres: number[];
  idEtat: number;
  synopsis: string;
  urlImage: string;
  dateDeParution: string;
}
