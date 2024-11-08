import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from "./components/theme/theme.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    
}
