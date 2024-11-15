import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { KeycloakOperationService } from './keycloak.service';
import { UserKeycloakProfile } from '../models/user-keycloak-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private keycloakService = inject(KeycloakOperationService);
  private detsroyRef = inject(DestroyRef);
  haveSetProfile = signal<boolean>(true);
  userInfo = signal<UserKeycloakProfile | undefined>(undefined);
  url = 'https://eco-craft.duckdns.org:2001/api/users/';
  isSameUser = signal<boolean>(false);

  async ngOnInit() {
    this.userInfo.set(
      (await this.keycloakService.getUserProfile()) as UserKeycloakProfile
    );
  }

  getUserProfile(id: string) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return this.httpClient.get(`${this.url}${id}`, { headers });
  }

  updateUserProfile(data: any) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include your auth token
    };

    return this.httpClient.put(this.url + 'profile', data, { headers });
  }

  addUserProfile(data: any) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include your auth token
    };

    return this.httpClient.post(this.url + 'profile', data, { headers });
  }
}
