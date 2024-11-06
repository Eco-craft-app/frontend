import { Component, computed, inject } from '@angular/core';

import { PrimaryNavComponent } from "../../components/primary-nav/primary-nav.component";
import { RouterOutlet } from '@angular/router';
import { KeycloakOperationService } from '../../services/keycloak.service';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [PrimaryNavComponent, RouterOutlet],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.scss'
})
export class RecycleComponent {
  private keycloakService = inject(KeycloakOperationService);
  profile = computed(() => this.keycloakService.getUserProfile())
  ngOnInit() {
    console.log(this.profile())
  }
}
