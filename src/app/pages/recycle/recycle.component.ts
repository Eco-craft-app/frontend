import { Component, computed, inject } from '@angular/core';
import { KeycloakService } from '../../keycloak.service';
import { PrimaryNavComponent } from "../../components/primary-nav/primary-nav.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [PrimaryNavComponent, RouterOutlet],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.scss'
})
export class RecycleComponent {
  private keycloakService = inject(KeycloakService);
  profile = computed(() => this.keycloakService.profile())
}
