import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak = signal<Keycloak | undefined>(undefined);
  private _profile = signal<UserProfile | undefined>(undefined);

  get keycloak() {
    if (!this._keycloak()) {
      this._keycloak.set(
        new Keycloak({
          url: 'http://localhost:18080',
          realm: 'recycle',
          clientId: 'public-client',
        })
      );
    }
    return this._keycloak();
  }

  profile = this._profile.asReadonly();

  async init() {
    const authenticated = await this.keycloak?.init({
      onLoad: 'login-required',
      redirectUri: 'http://localhost:4200/recycle'
    });

    console.log('Authenticated:', authenticated);

    if (authenticated) {
      const profile = await this.keycloak?.loadUserProfile();
      if (profile) {
        this._profile.set({
          ...profile,
          token: this.keycloak?.token,
          refreshToken: this.keycloak?.refreshToken,
        });
      }
      console.log('Profile:', profile);
    }
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false; // Zakładając, że `authenticated` jest właściwością Keycloak
  }  

  login() {
    return this.keycloak?.login({
      redirectUri: 'http://localhost:4200/recycle',
    });
  }

  logout() {
    return this.keycloak?.logout({ redirectUri: 'http://localhost:4200/home' });
  }

  async refresh(): Promise<boolean> {
    try {
      if (this.keycloak) {
        const refreshed = await this.keycloak.updateToken(300);
        if (refreshed) {
          console.log('Token was successfully refreshed.');
          this._profile.set(
            (await this.keycloak?.loadUserProfile()) as UserProfile
          );
          this._profile()!.token = this.keycloak?.token;
          this._profile()!.refreshToken = this.keycloak?.refreshToken;
        } else {
          console.log('Token is still valid.');
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.logout();
    }
    return false;
  }
}
