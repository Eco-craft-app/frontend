import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ButtonSignComponent } from "../../shared/button-sign/button-sign.component";
import { KeycloakService } from '../../keycloak.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, ButtonSignComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private keycloakService = inject(KeycloakService);
  profile = this.keycloakService.profile

  ngAfterViewInit() {
    console.log(this.keycloakService.profile())
  }

  async redirectToKeycloak() {
    try {
      await this.keycloakService.init(); // Inicjalizacja Keycloak tylko raz
      const isAuthenticated = this.keycloakService.isAuthenticated();
  
      if (!isAuthenticated) {
        await this.keycloakService.login(); // Tylko jeśli nie jest zalogowany
      } else {
        console.log('User is already authenticated');
      }
    } catch (error) {
      console.error('Error during Keycloak authentication', error);
    }
  }
}
