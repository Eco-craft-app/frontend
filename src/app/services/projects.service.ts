import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects = signal<Project[]>([]);
  sortOrder = signal<string>('desc');
  page = signal<string>('1');
  pageSize = signal<string>('6');
  totalPages = signal<number >(0);
  constructor(private httpClient: HttpClient) {}
  allProjects = this.projects.asReadonly();

  updateProjects(projects: Project[]) { 
    this.projects.set(projects);
  }

  getProjectById(id: string) {
    return this.httpClient.get(`https://localhost:5001/api/projects/${id}`);
  }

  toggleLike(projectId: string, isAlreadyLiked: boolean) {
    const token = JSON.parse(localStorage.getItem('userToken')!); // Zmienna przechowująca Twój Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });

    if (isAlreadyLiked) {
      return this.httpClient.delete(`https://localhost:5001/api/projects/${projectId}/likes`);
    } else {
      return this.httpClient.post(`https://localhost:5001/api/projects/${projectId}/likes`, {}, { headers });
    }
  }

  getProjects(
    page: string,
    pageSize: string,
    filters?: { title?: string; userId?: string },
    sorts?: string
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

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

    return this.httpClient.get('https://localhost:5001/api/projects', { params });
  }
}