import { Component } from '@angular/core';
import { ThemeComponent } from "../theme/theme.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
