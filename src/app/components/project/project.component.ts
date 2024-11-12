import { Component, DestroyRef, inject, input } from '@angular/core';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { ShortenNumberPipe } from '../../pipes/shortenNumber.pipe';
import { Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ShortenNumberPipe, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private projectService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  projectData = input.required<Project>()

  projectRedirect(e: FocusEvent) {
    const target = e.target as HTMLElement;
    console.log(target.classList)
    console.log(target.classList[0].includes('likes'))
    if(target.classList[0].includes('likes')) {
      return
    }
    this.router.navigate([`/recycle/project/${this.projectData().projectId}`]);
  }

  userProfileRedirect() {
    this.router.navigate([`/recycle/profile/${this.projectData().userId}`]);
  }

  toggleLike() {
    const sub = this.projectService.toggleLike(this.projectData().projectId, this.projectData().isLikedByTheCurrentUser).subscribe({
      next: (res) => {
        console.log(res)
        this.projectService.getProjects(this.projectService.page(), this.projectService.pageSize()).subscribe({
          next: (data: any) => {
            console.log(data);
            this.projectService.updateProjects(data.items as Project[]);
          }
        })
      }
    })
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    })
  }
}
