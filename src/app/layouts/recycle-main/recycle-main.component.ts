import { HttpClient } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { ProjectComponent } from '../../components/project/project.component';

@Component({
  selector: 'app-recycle-main',
  standalone: true,
  imports: [ProjectComponent],
  templateUrl: './recycle-main.component.html',
  styleUrl: './recycle-main.component.scss'
})
export class RecycleMainComponent {
  private httpClient = inject(HttpClient);
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef)
  projects = computed(() => this.projectsService.allProjects()) 
  page = signal<string>('1');
  pageSize = signal<string>('15');
  constructor() {
    const res = this.projectsService.getProjects(this.page(), this.pageSize()).subscribe({
      next: (data: any) => {
        console.log(data)
        this.projectsService.updateProjects(data.items as Project[])
      },
      error: (err: any) => {
        console.log(err)
      }
    })
    console.log(this.projects())
    this.destroyRef.onDestroy(() => {
      res.unsubscribe()
    })
  }
}
