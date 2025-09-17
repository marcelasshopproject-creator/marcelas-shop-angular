import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* Components */
import { Header } from './shared/ui/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('marcelas-shop-angular');
}
