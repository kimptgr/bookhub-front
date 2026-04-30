import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './commun/navbar/navbar';
import {Footer} from './commun/footer/footer';
import {Toast} from 'primeng/toast';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    ConfirmationService
  ]
})
export class App {
  protected readonly title = signal('BookHub-front');
}
