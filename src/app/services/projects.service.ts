import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeycloakOperationService } from './keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projects = signal<Project[]>([]);
  private keycloakService = inject(KeycloakOperationService);

  sortOrder = signal<string>('desc');
  page = signal<string>('1');
  pageSize = signal<string>('5');
  totalPages = signal<number>(1);
  constructor(private httpClient: HttpClient) {}
  allProjects = this.projects.asReadonly();

  updateProjects(projects: Project[]) {
    this.projects.set(projects);
  }

  getProjectById(id: string) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(
      `https://eco-craft.duckdns.org:2001/api/projects/${id}`,
      {
        headers,
      }
    );
  }

  deleteProject(id: string) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.delete(
      `https://eco-craft.duckdns.org:2001/api/projects/${id}`,
      {
        headers,
      }
    );
  }

  toggleLike(projectId: string, isAlreadyLiked: boolean) {
    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });

    if (isAlreadyLiked) {
      return this.httpClient.delete(
        `https://eco-craft.duckdns.org:2001/api/projects/${projectId}/likes`,
        { headers }
      );
    } else {
      return this.httpClient.post(
        `https://eco-craft.duckdns.org:2001/api/projects/${projectId}/likes`,
        {},
        { headers }
      );
    }
  }

  getProjectsEarly(page: string, pageSize: string, userToken: string) {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.get(
      'https://eco-craft.duckdns.org:2001/api/projects',
      {
        params,
        headers,
      }
    );
  }

  getLikedProjects(
    page: string,
    pageSize: string,
    filters?: { title?: string; userId?: string },
    sorts?: string
  ) {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (filters) {
      if (filters.title) {
        params = params.append('Filters', `title_=*${filters.title}`);
      }
      if (filters.userId) {
        params = params.append('Filters', `userId==${filters.userId}`);
      }
    }

    // Dodaj sortowanie, jeśli jest dostępne
    if (sorts) {
      params = params.append('Sorts', sorts);
    }

    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });

    return this.httpClient.get(
      'https://eco-craft.duckdns.org:2001/api/projects/liked',
      {
        params,
        headers,
      }
    );
  }

  getProjects(
    page: string,
    pageSize: string,
    filters?: { title?: string; userId?: string },
    sorts?: string,
    userToken?: string
  ) {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    // Dodaj filtry, jeśli są dostępne
    if (filters) {
      if (filters.title) {
        params = params.append('Filters', `title_=*${filters.title}`);
      }
      if (filters.userId) {
        params = params.append('Filters', `userId==${filters.userId}`);
      }
    }

    // Dodaj sortowanie, jeśli jest dostępne
    if (sorts) {
      params = params.append('Sorts', sorts);
    }

    let token = undefined;
    const tokenJSON = localStorage.getItem('userToken');
    if (
      tokenJSON !== 'undefined' &&
      tokenJSON !== null &&
      tokenJSON !== undefined
    ) {
      token = JSON.parse(tokenJSON!);
    }
    if (!token) {
      token = userToken;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });

    return this.httpClient.get(
      'https://eco-craft.duckdns.org:2001/api/projects',
      {
        params,
        headers,
      }
    );
  }
}
