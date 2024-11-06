import { Component } from '@angular/core';
import { ThemeComponent } from "../theme/theme.component";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-primary-nav',
  standalone: true,
  imports: [ThemeComponent, RouterLink, RouterLinkActive],
  templateUrl: './primary-nav.component.html',
  styleUrl: './primary-nav.component.scss'
})
export class PrimaryNavComponent {

}
