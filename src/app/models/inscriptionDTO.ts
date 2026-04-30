// permet de communiquer au DTO du back pour l'inscription avec le champs prénom en optionnel du au ?'
export interface InscriptionDTO {
  nom: string;
  prenom?: string;
  email: string;
  password: string;
  telephone?: string;
}
