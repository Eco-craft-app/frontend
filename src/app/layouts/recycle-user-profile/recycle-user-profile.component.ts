import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../models/user-info.model';
import { ProjectComponent } from '../../components/project/project.component';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recycle-user-profile',
  standalone: true,
  imports: [ProjectComponent, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './recycle-user-profile.component.html',
  styleUrl: './recycle-user-profile.component.scss',
})
export class RecycleUserProfileComponent {
  private userService = inject(UserService);
  private keycloakService = inject(KeycloakOperationService);
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);
  id = input.required<string>();
  userProfile = signal<undefined | UserInfo>(undefined);
  isSameUser = signal<boolean>(false);
  userProjects = computed(() => this.projectsService.allProjects());
  numberOfPages = computed(() => this.projectsService.totalPages());
  totalPages = computed(() => this.projectsService.totalPages());
  arrayPages = Array.from({ length: this.numberOfPages() }, (_, i) => i + 1);
  pageSize = computed(() => this.projectsService.pageSize());
  page = computed(() => this.projectsService.page());
  pageNumber = signal(Number(this.page()));
  shownArrayPages = this.arrayPages.slice(
    this.pageNumber() - 1,
    this.pageNumber() + 4
  );
  sortOrder = computed(() => this.projectsService.sortOrder());
  isUserProjects = signal<boolean>(true);

  async ngOnInit() {
    console.log(this.id());
    console.log(this.userService.userInfo());
    let profile = undefined;
    if (this.keycloakService.isLoggedIn()) {
      profile = await this.keycloakService.getUserProfile();
    }

    if (profile) {
      if (profile.id === this.id()) {
        this.isSameUser.set(true);
        this.userService.isSameUser.set(true);
      }
    }
    console.log(this.isSameUser());
    const sub = this.userService.getUserProfile(this.id()).subscribe({
      next: (data) => {
        this.userProfile.set(data as UserInfo);
        console.log(this.userProfile());
      },
    });
    const sorts = this.sortOrder() === 'asc' ? 'likeCount' : '-likeCount';
    // const sub2 = this.projectsService
    //   .getProjects(
    //     this.projectsService.page(),
    //     this.projectsService.pageSize(),
    //     { userId: this.id() },
    //     sorts
    //   )
    //   .subscribe({
    //     next: (data) => {
    //       console.log(data);
    //       const projectData = data as { items: Project[] };
    //       const totalPages = data as { totalPages: number };
    //       console.log(totalPages.totalPages);
    //       console.log(projectData.items);
    //       this.projectsService.updateProjects(projectData.items);
    //       // this.userProjects.set(projectData.items);
    //       this.projectsService.totalPages.set(totalPages.totalPages);
    //       this.updateArrayPagesNew();
    //       console.log(this.userProjects());
    //     },
    //   });
    // this.destroyRef.onDestroy(() => {
    //   sub.unsubscribe();
    // });
  }

  getUserProjects() {
    const sorts = this.sortOrder() === 'asc' ? 'likeCount' : '-likeCount';
    const sub = this.projectsService
      .getProjects(
        this.projectsService.page(),
        this.projectsService.pageSize(),
        { userId: this.id() },
        sorts
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          const projectData = data as { items: Project[] };
          const totalPages = data as { totalPages: number };
          console.log(totalPages.totalPages);
          console.log(projectData.items);
          this.projectsService.updateProjects(projectData.items);
          // this.userProjects.set(projectData.items);
          this.projectsService.totalPages.set(totalPages.totalPages);
          this.updateArrayPagesNew();
          console.log(this.userProjects());
        },
      });
  }

  getLikedProjects() {
    const sorts = this.sortOrder() === 'asc' ? 'likeCount' : '-likeCount';
    const sub = this.projectsService
      .getLikedProjects(
        this.projectsService.page(),
        this.projectsService.pageSize(),
        {},
        // { userId: this.id() },
        sorts
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          const projectData = data as { items: Project[] };
          const totalPages = data as { totalPages: number };
          console.log(totalPages.totalPages);
          console.log(projectData.items);
          this.projectsService.updateProjects(projectData.items);
          // this.userProjects.set(projectData.items);
          this.projectsService.totalPages.set(totalPages.totalPages);
          this.updateArrayPagesNew();
          console.log(this.userProjects());
        },
      });
  }

  updateArrayPagesNew() {
    const total = this.totalPages(); // Łączna liczba stron
    const currentPage = this.pageNumber(); // Bieżąca strona
    const pagesToShow = 5; // Liczba stron do wyświetlenia na raz
    let startPage = currentPage - Math.floor(pagesToShow / 2); // Określenie strony początkowej

    // Upewnij się, że startPage nie jest mniejszy niż 1
    startPage = Math.max(startPage, 1);

    // Upewnij się, że endPage nie przekroczy liczby stron
    let endPage = startPage + pagesToShow - 1;
    endPage = Math.min(endPage, total);

    // Jeśli startPage jest zbyt blisko początku, musimy dostosować startPage
    startPage = Math.max(endPage - pagesToShow + 1, 1);

    // Tworzymy tablicę numerów stron
    this.arrayPages = Array.from({ length: total }, (_, i) => i + 1);

    // Wyświetlamy odpowiednią część tablicy
    this.shownArrayPages = this.arrayPages.slice(startPage - 1, endPage);
    console.log('Updated arrayPages:', this.shownArrayPages);
  }

  fetchProjects() {
    const filters = { userId: this.id() };
    const sorts =
      this.projectsService.sortOrder() === 'asc' ? 'likeCount' : '-likeCount';

    if (this.isUserProjects()) {
      this.projectsService
        .getProjects(this.page(), this.pageSize(), filters, sorts)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.projectsService.updateProjects(data.items as Project[]);
            // this.userProjects.set(data.items as Project[]);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    } else {
      this.projectsService
        .getLikedProjects(this.page(), this.pageSize(), filters, sorts)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.projectsService.updateProjects(data.items as Project[]);
            // this.userProjects.set(data.items as Project[]);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  changePage(page: number) {
    console.log('changePage', page);
    this.projectsService.page.update((prev: string) => page.toString());
    this.pageNumber.set(page);
    this.updateArrayPagesNew();
    this.fetchProjects();
  }
  prevFirstPage() {
    console.log('prevFirstPage');
    this.projectsService.page.update((prev: string) => '1');
    this.pageNumber.set(1);
    this.updateArrayPagesNew();
    this.fetchProjects();
  }
  prevPage() {
    console.log('prevPage');
    this.projectsService.page.update((prev: string) =>
      (Number(prev) - 1).toString()
    );
    this.pageNumber.update((prev: number) => prev - 1);
    this.updateArrayPagesNew();
    console.log(this.page());
    console.log(this.pageNumber);
    this.fetchProjects();
  }
  nextPage() {
    console.log('nextPage');
    this.projectsService.page.update((prev: string) =>
      (Number(prev) + 1).toString()
    );
    console.log(this.page());
    this.pageNumber.update((prev: number) => prev + 1);
    this.updateArrayPagesNew();
    console.log(this.pageNumber);
    this.fetchProjects();
  }
  nextLastPage() {
    console.log('nextLastPage');
    this.projectsService.page.update((prev: string) =>
      this.arrayPages.length.toString()
    );
    this.pageNumber.set(this.arrayPages.length);
    this.updateArrayPagesNew();
    this.fetchProjects();
  }
}
