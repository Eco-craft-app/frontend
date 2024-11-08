import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class KeycloakOperationService {
  constructor(private readonly keycloak: KeycloakService) {}

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }
  logout(): void {
    this.keycloak.logout();
  }
  async getUserProfile() {
    const profile = await this.keycloak.loadUserProfile();
    return profile
  }
  async getUserTokens() {
    return await this.keycloak.getToken();
  }
  async getUserDatas() {
    const profile = await this.keycloak.loadUserProfile();
    const token = await this.keycloak.getToken();
    return { profile, token }
  }
  // Add other methods as needed for token access, user info retrieval, etc.}
}