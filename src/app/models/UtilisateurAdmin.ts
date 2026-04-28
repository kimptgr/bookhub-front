
import { Role } from './enum/roles-enum';

export interface UtilisateurAdmin {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  desactive: boolean;
}
