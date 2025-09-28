import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* Components */
import { Header } from './shared/ui/header/header';
import { Footer } from './shared/ui/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal("Marcelas's Shop");
}
