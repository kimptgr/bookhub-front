import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Auteur} from '../../models/auteur';

@Injectable({
  providedIn: 'root'
})

export class OpenlibrairyService {
  constructor(private http: HttpClient) {
  }

  getLivrePartiel(isbn: string): Observable<LivrePartiel> {
    const livreAPI = this.http.get<OpenLibrairyResponse>(this.createURLBook(isbn));
    return livreAPI.pipe(
      map(response => {
        if (response.numFound != 1) { throw new Error("Impossible de préremplir.")}
        return {
          titre: response.docs[0].title,
          auteur: this.auteurMapper(response.docs[0].author_name),
          annee: response.docs[0].first_publish_year,
          urlImage: this.createURLCover(isbn)
        }
      })
    )
  }

  createURLCover(isbn: string): string {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }

  createURLBook(isbn: string): string {
    return `https://openlibrary.org/search.json?q=${isbn}`;
  }

  private auteurMapper(author_name: string[]): Auteur[] {
    if (author_name.length > 0) {
      return author_name.map(auteur =>
        { let auteurArray = auteur.split(' ');
          if (auteurArray.length > 1) {
            return {prenomAuteur: auteurArray.shift()?? '', nomAuteur: auteurArray.join(' ') }
          }
          return {nomAuteur: auteur?? '', prenomAuteur: ''}});
    }
    return [];
  }
}

export interface OpenLibrairyResponse {
  numFound: number,
  docs: [
    {
      author_name: string[],
      "title": string,
      "first_publish_year": number
    }]
}

export interface LivrePartiel {
  titre: string;
  auteur: Auteur[];
  annee: number;
  urlImage: string;
}
