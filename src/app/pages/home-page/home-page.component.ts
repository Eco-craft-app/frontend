import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ButtonSignComponent } from "../../shared/button-sign/button-sign.component";
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, ButtonSignComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private router = inject(Router);
  private keycloakService = inject(KeycloakService)

  loginRedirect() {
    if (this.keycloakService.isLoggedIn()) {
      this.router.navigate(['/recycle'])
    } else {
      this.router.navigate(['/login'])
    }
  }
}
