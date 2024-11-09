import { Component, computed, inject, signal } from '@angular/core';

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

  userData = signal<undefined | any>(undefined);

  async ngOnInit() {
    const token = await this.keycloakService.getUserTokens()
    localStorage.setItem('userToken', JSON.stringify(token))
    this.userData.set(await this.keycloakService.getUserDatas())
    console.log(this.userData())
  }
}
