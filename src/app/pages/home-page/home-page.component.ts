import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ButtonSignComponent } from "../../shared/button-sign/button-sign.component";
import { KeycloakService } from '../../keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, ButtonSignComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);
  profile = this.keycloakService.profile

  ngAfterViewInit() {
    console.log(this.keycloakService.profile())
  }

  loginRedirect() {
    this.router.navigate(['/login'])
  }
}
