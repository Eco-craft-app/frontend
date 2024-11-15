import { Component, computed, inject, input, signal } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectsService } from '../../services/projects.service';
import { ProjectInfo } from '../../models/project-info.model';
import { ProjectInfoService } from '../../services/project-info.service';

@Component({
  selector: 'app-project-description',
  standalone: true,
  imports: [],
  templateUrl: './project-description.component.html',
  styleUrl: './project-description.component.scss'
})
export class ProjectDescriptionComponent {
  private projectInfoService = inject(ProjectInfoService);
  project = signal<undefined | any>(undefined);
  desc = computed(() => this.projectInfoService.getProjectInfoDescription());
}
