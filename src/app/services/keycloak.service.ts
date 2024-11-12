import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class KeycloakOperationService {
  constructor(private readonly keycloak: KeycloakService, private router: Router) {}

  async redirectToRegister() {
    const registerUrl = await this.keycloak.getKeycloakInstance().createRegisterUrl({
      redirectUri: 'http://localhost:4200/recycle/your_username/edit',
    });
    localStorage.removeItem('isProfileSet');
    window.location.href = registerUrl;
  }

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }
  logout(): void {
    this.keycloak.logout('http://localhost:4200/recycle');
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