import { Injectable, signal } from '@angular/core';
import { ProjectInfo } from '../models/project-info.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectInfoService {
  private projectInfo = signal<ProjectInfo | undefined>(undefined);
  publicProjectInfo = this.projectInfo.asReadonly();

  setProjectInfo(projectInfo: ProjectInfo) {
    this.projectInfo.set(projectInfo);
  }

  getProjectInfoDescription() {
    return this.publicProjectInfo()?.description;
  }

  constructor() { }
}
