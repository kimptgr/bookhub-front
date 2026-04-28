import {Component, Input, Signal, WritableSignal} from '@angular/core';
import {Message} from 'primeng/message';
import {MultiSelect} from 'primeng/multiselect';
import {AsyncPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {UserDTO} from '../../../../models/userDTO';
import {UtilisateurService} from '../../../../services/utilisateurService';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-choix-utilisateur',
  imports: [
    Message,
    FormsModule,
    ReactiveFormsModule,
    Select,
    FloatLabel
  ],
  templateUrl: './choix-utilisateur.html',
  styleUrl: './choix-utilisateur.css',
})
export class ChoixUtilisateur {
  users: Signal<UserDTO[] | null>;
  userId: number | null = null;
  showErrorMessage: boolean = false;
  @Input() userIdSignal!:WritableSignal<number | null>

  constructor(private userService :UtilisateurService) {
    this.userService.loadUsers()
    this.users = userService.users;
  }

  onSelectUser() {
    this.userIdSignal.set(this.userId)
  }


}
