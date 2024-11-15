import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import {
  ProjectInfo,
  ProjectInfoPhotos,
} from '../../models/project-info.model';
import { UserInfo } from '../../models/user-info.model';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ShortenNumberPipe } from '../../pipes/shortenNumber.pipe';
import { Project } from '../../models/project.model';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectInfoService } from '../../services/project-info.service';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);  // Rejestracja lokalizacji dla Polski

@Component({
  selector: 'app-recycle-project-info',
  standalone: true,
  imports: [DatePipe, ShortenNumberPipe, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './recycle-project-info.component.html',
  styleUrl: './recycle-project-info.component.scss',
})
export class RecycleProjectInfoComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private projectInfoService = inject(ProjectInfoService);
  private httpClient = inject(HttpClient);
  private projectsService = inject(ProjectsService);
  private destroyRey = inject(DestroyRef);
  private keycloakService = inject(KeycloakOperationService);
  private router = inject(Router);
  private userService = inject(UserService);
  projectInfo = signal<undefined | ProjectInfo>(undefined);
  project = signal<undefined | Project>(undefined);
  userInfo = signal<undefined | UserInfo>(undefined);
  photos = signal<ProjectInfoPhotos[]>([]);
  actualPhoto = signal<string>('');
  id = input.required<string>();
  isLoggedIn = this.keycloakService.isLoggedIn();
  isLiking = signal<boolean>(false);
  isSameUser = signal<boolean>(false);
  toastrService = inject(ToastrService);

  async ngOnInit() {
    console.log(this.isSameUser());
    console.log(this.id());
    const sub = this.projectsService.getProjectById(this.id()).subscribe({
      next: async (project) => {
        console.log(project);
        this.project.set(project as Project);
        let profile = undefined;
        if (this.isLoggedIn) {
          profile = await this.keycloakService.getUserProfile();
        }

        if (profile) {
          if (profile.id === this.project()!.userId) {
            this.isSameUser.set(true);
            this.userService.isSameUser.set(true);
          }
        }
        console.log(this.project()!.userId);
        this.projectInfo.set(project as ProjectInfo);
        this.projectInfoService.setProjectInfo(this.projectInfo()!);
        this.photos.set(this.projectInfo()!.photos.sort((a: any, b: any) => {
          return b.isMain - a.isMain;
        }));
        console.log(this.photos());
        this.actualPhoto.set(this.photos().find((photo) => photo.isMain)!.url);
        console.log(this.projectInfo());
        console.log(this.project());
        this.httpClient
          .get(`https://localhost:5001/api/users/${this.projectInfo()!.userId}`)
          .subscribe({
            next: (user) => {
              this.userInfo.set(user as UserInfo);
            },
          });
      },
    });

    this.destroyRey.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  likeProject() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
    this.isLiking.set(true);
    console.log(this.project()!.isLikedByCurrentUser);
    console.log(this.projectInfo()!.projectId);
    const sub = this.projectsService
      .toggleLike(
        this.projectInfo()!.projectId,
        this.project()!.isLikedByCurrentUser
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.projectsService.getProjectById(this.id()).subscribe({
            next: (project) => {
              console.log(project);
              this.project.set(project as Project);
              this.projectInfo.set(project as ProjectInfo);
              console.log(this.project());
            },
          });
          // this.projectInfo.set(data as ProjectInfo);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLiking.set(false);
        },
      });
  }
  
  deleteProject() {
    this.projectsService.deleteProject(this.project()!.projectId).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/recycle']);
        this.toastrService.success('Projekt usunięty pomyślnie', 'Sukces');
      }, error: (err) => {
        this.toastrService.error('Wystąpił błąd podczas usuwania projektu', 'Wystąpił błąd');
      }
    })
  }

  nextPhoto() {
    const index = this.photos().findIndex(
      (photo) => photo.url === this.actualPhoto()
    );
    if (index === this.photos().length - 1) {
      this.actualPhoto.set(this.photos()[0].url);
    } else {
      this.actualPhoto.set(this.photos()[index + 1].url);
    }
  }
  previousPhoto() {
    const index = this.photos().findIndex(
      (photo) => photo.url === this.actualPhoto()
    );
    if (index === 0) {
      this.actualPhoto.set(this.photos()[this.photos().length - 1].url);
    } else {
      this.actualPhoto.set(this.photos()[index - 1].url);
    }
  }

  onSelectPhoto(photo: ProjectInfoPhotos, indexFromEnd: number) {
    this.actualPhoto.set(photo.url);

    // const container = this.scrollContainer.nativeElement;
    // const elements = container.querySelectorAll('.recycle-project-info__gallery-thumbnail');
    // const targetElement = elements[elements.length - indexFromEnd];
    // console.log(container)
    // console.log(elements)
    // console.log(targetElement.offsetTop)

    // if (targetElement) {
    //   container.scrollTop = targetElement.offsetTop - container.offsetTop - 300;
    // }
  }
  navigateToComments() {
    window.scrollTo(0, 500);
  }
}
