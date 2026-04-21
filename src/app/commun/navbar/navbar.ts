import {Component} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  onMenuBurger(): void {
    const menu = document.querySelector('.mobile-menu');
    menu?.classList.toggle('hidden');
  }
}
