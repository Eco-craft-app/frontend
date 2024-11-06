import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../keycloak.service';

@Component({
  selector: 'app-recycle-main',
  standalone: true,
  imports: [],
  templateUrl: './recycle-main.component.html',
  styleUrl: './recycle-main.component.scss'
})
export class RecycleMainComponent {
  private keycloakService = inject(KeycloakService);
  ngOnInit() {
    console.log(this.keycloakService.profile());
  }
}
