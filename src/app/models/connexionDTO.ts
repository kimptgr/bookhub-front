// permet de communiquer au DTO du back pour la connexion
export interface ConnexionDTO {
  email: string;
  password: string;
}

// permet de récupérer le token
export interface TokenResponse {
  token: string;
}
