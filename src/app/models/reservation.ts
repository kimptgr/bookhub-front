export interface Reservation {
  id: number,
  livreId: number,
  utilisateurId:number,
  dateDemandeReservation: Date,
  dateDisponibilite?: Date,
  dateRetraitMax?: Date,
  statut: Statut,
  estSupprimee: boolean
}

interface Statut {
  id?: string,
  libelle: 'SUR_LISTE_D_ATTENTE' | 'EN_ATTENTE_DE_RETRAIT' | 'CLOTUREE' | 'ANNULEE'
}
