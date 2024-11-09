import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects = signal<Project[]>([]);
  constructor(private httpClient: HttpClient) {}
  allProjects = this.projects.asReadonly();

  updateProjects(projects: Project[]) { 
    this.projects.set(projects);
  }
  getProjects(page: string, pageSize: string) {
    return this.httpClient.get('https://localhost:5001/api/projects?page=' + page + '&pageSize=' + pageSize);
  }

}
