import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { KeycloakOperationService } from './keycloak.service';
import { UserKeycloakProfile } from '../models/user-keycloak-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient)
  private keycloakService = inject(KeycloakOperationService)
  private detsroyRef = inject(DestroyRef)
  haveSetProfile = signal<boolean>(true)
  userInfo = signal<UserKeycloakProfile | undefined>(undefined)
  url = 'https://localhost:5001/api/users/'

  async ngOnInit() {
    this.userInfo.set(await this.keycloakService.getUserProfile() as UserKeycloakProfile)
    console.log(this.userInfo())
  }

  getUserProfile(id: string) {
    return this.httpClient.get(`${this.url}${id}`)
  }

  updateUserProfile(data: any) {
    const token = localStorage.getItem('userToken')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token!)}` // Include your auth token
    };
    console.log(headers)
    return this.httpClient.put(this.url + 'profile', data, {headers})
  }

  addUserProfile(data: any) {
    const token = localStorage.getItem('userToken')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token!)}` // Include your auth token
    };
    console.log(headers)
    return this.httpClient.post(this.url + 'profile', data, {headers})
  }
}
