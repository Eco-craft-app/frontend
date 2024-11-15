import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { ShortenNumberPipe } from '../../pipes/shortenNumber.pipe';
import { Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ShortenNumberPipe, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private userService = inject(UserService);
  private projectService = inject(ProjectsService);
  private keycloakService = inject(KeycloakOperationService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  projectData = input.required<Project>()
  isUserProfile = input<boolean>(false);
  isSameUser = input<boolean>(false);
  isAllowedToDelete = signal<boolean>(false)
  isLoggedIn = this.keycloakService.isLoggedIn();
  isToggling = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  userId = input<string>('');

  async ngOnInit() {
    if(!this.userId()) {
      this.isAllowedToDelete.set(true)
    } else if(this.userId() === this.projectData().userId) {
      this.isAllowedToDelete.set(true);
    }
    this.userService.isSameUser.set(this.isSameUser());
    // console.log(this.projectData());
    // console.log(this.isSameUser())
    // console.log(this.isUserProfile())
  }

  projectRedirect(e: FocusEvent) {
    const target = e.target as HTMLElement;
    console.log(target.classList[0].includes('likes'))
    console.log(target.classList[0].includes('delete'))
    console.log(target.classList[0])
    if(!target.classList[0]) {
      return
    }
    if(target.classList[0].includes('likes') || target.classList[0].includes('delete') || target.classList[0].includes('comment')) {
      return
    }
    this.router.navigate([`/recycle/project/${this.projectData().projectId}/description`]);
  }

  userProfileRedirect() {
    this.projectService.page.set('1');
    this.router.navigate([`/recycle/profile/${this.projectData().userId}/projects`]);
  }
  
  deleteProject() {
    const filter = this.isUserProfile() ? { userId: this.projectData().userId! } : undefined;
    this.isDeleting.set(true);
    const sub = this.projectService.deleteProject(this.projectData().projectId).subscribe({
      next: (res) => {
        console.log(res);
        this.projectService.getProjects(this.projectService.page(), this.projectService.pageSize(), filter, this.projectService.sortOrder() === 'asc' ? 'likeCount' : '-likeCount').subscribe({
          next: (data: any) => {
            console.log(data);
            this.projectService.totalPages.set(data.totalPages);
            this.projectService.updateProjects(data.items as Project[]);
          }
        })
      }, error: (err) => {

      }, complete: () => {
        this.isDeleting.set(false);
      }
    })
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    })
  }

  toggleLike() {
    if(!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.isToggling.set(true);
    console.log(this.isToggling())
    const filter = this.isUserProfile() ? { userId: this.projectData().userId! } : undefined;

    const sub = this.projectService.toggleLike(this.projectData().projectId, this.projectData().isLikedByCurrentUser).subscribe({
      next: (res) => {
        console.log(res)
        this.projectService.getProjects(this.projectService.page(), this.projectService.pageSize(), filter, this.projectService.sortOrder() === 'asc' ? 'likeCount' : '-likeCount').subscribe({
          next: (data: any) => {
            console.log(data);
            this.projectService.updateProjects(data.items as Project[]);
          }
        })
      }, error: (err) => {
        console.log(err)
      }, complete: () => {
        this.isToggling.set(false);
      }
    })
    console.log(this.isToggling())
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    })
  }
}
