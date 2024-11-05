import { Component, computed, inject } from '@angular/core';
import { KeycloakService } from '../../keycloak.service';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.scss'
})
export class RecycleComponent {
  private keycloakService = inject(KeycloakService);
  profile = computed(() => this.keycloakService.profile())
}
