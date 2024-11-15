import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { ThemeComponent } from "../theme/theme.component";
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-primary-nav',
  standalone: true,
  imports: [ThemeComponent, RouterLink, RouterLinkActive],
  templateUrl: './primary-nav.component.html',
  styleUrl: './primary-nav.component.scss'
})
export class PrimaryNavComponent {
  private elementRef = inject(ElementRef);
  private projectsService = inject(ProjectsService);
  private keycloakService = inject(KeycloakOperationService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  userProfile = signal<undefined | any>(undefined);
  searchQuery = signal<string>(''); // Zmienna do przechowywania wartości wyszukiwania

  isLoginVisible = signal<boolean>(false);
  isUserInfoVisible = signal<boolean>(false);
  isProfileSet = JSON.parse(localStorage.getItem('isProfileSet')!)
  private searchSubject = new Subject<string>(); // Subject do obsługi debouncingu

  async ngOnInit() {
    try {
      this.userProfile.set(await this.keycloakService.getUserProfile())
      console.log(this.userProfile())
    } catch(err) {

    }
  }

  constructor() {
    // Subskrybuj zmiany w wyszukiwaniu z debouncingiem
    console.log(this.userService.userInfo())
    this.searchSubject.pipe(
      debounceTime(300), // Opóźnienie 300ms
      switchMap(query => {
        this.searchQuery.set(query);
        return this.projectsService.getProjects(this.projectsService.page(), this.projectsService.pageSize(), { title: query }, this.projectsService.sortOrder() === 'asc' ? 'likeCount' : '-likeCount');
      })
    ).subscribe({
      next: (data: any) => {
        console.log(data);
        this.projectsService.updateProjects(data.items as Project[]);
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.searchSubject.complete();
    });
  }

  viewProfile() {
    this.projectsService.page.set('1');
    this.router.navigate([`/recycle/profile/${this.userProfile()!.id}/projects`]);
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement; 
    this.searchSubject.next(target.value); 
  }

  toggleLoginPopup(event: MouseEvent) {
    event.stopPropagation();
    this.isLoginVisible.update(visible => !visible);
    this.isUserInfoVisible.set(false);
  }
  toggleUserInfoPopup(event: MouseEvent) {
    event.stopPropagation();
    this.isUserInfoVisible.update(visible => !visible);
    this.isLoginVisible.set(false);
  }
  closePopups() {
    this.isLoginVisible.set(false)
    this.isUserInfoVisible.set(false)
  }
  logout() {
    this.keycloakService.logout();
  }
  onRegister() {
    this.keycloakService.redirectToRegister();
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closePopups();
    }
  }
}
