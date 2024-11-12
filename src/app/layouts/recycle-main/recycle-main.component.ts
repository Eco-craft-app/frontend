import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { ProjectComponent } from '../../components/project/project.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-recycle-main',
  standalone: true,
  imports: [ProjectComponent, FormsModule],
  templateUrl: './recycle-main.component.html',
  styleUrl: './recycle-main.component.scss'
})
export class RecycleMainComponent {
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);
  
  projects = computed(() => this.projectsService.allProjects());
  page = computed(() => this.projectsService.page());
  pageSize = computed(() => this.projectsService.pageSize());
  pageNumber = signal(Number(this.page()))
  numberOfPages = computed(() => this.projectsService.totalPages())
  totalPages = signal(this.numberOfPages())
  arrayPages = Array.from({ length: this.numberOfPages() }, (_, i) => i + 1);
  shownArrayPages = this.arrayPages.slice(this.pageNumber() - 1,  this.pageNumber() + 4);
  searchQuery = signal<string>(''); // Zmienna do przechowywania wartości wyszukiwania
  sortOrder = computed(() => this.projectsService.sortOrder());

  constructor() {
    this.projectsService.getProjects(this.page(), this.pageSize()).subscribe({
      next: (data: any) => {
        console.log(data);
        console.log(data.totalPages);
        this.projectsService.totalPages.set(data.totalPages);
        this.totalPages.set(data.totalPages);
        this.updateArrayPages()
      },
      error: (err: any) => {
        console.log(err);
      }
    })
    this.fetchProjects();

    // Subskrybuj zmiany w wyszukiwaniu z debouncingiem
    this.searchSubject.pipe(
      debounceTime(300), // Opóźnienie 300ms
      switchMap(query => {
        this.searchQuery.set(query);
        this.projectsService.sortOrder.update((prev: string) => prev === 'asc' ? 'likeCount' : '-likeCount');
        return this.projectsService.getProjects(this.page(), this.pageSize(), { title: query }, this.sortOrder() === 'asc' ? 'likeCount' : '-likeCount');
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
  ngAfterViewInit() {
    console.log(this.numberOfPages())
    console.log(this.pageNumber())
  }

  updateArrayPages() {
    this.arrayPages = Array.from({ length: this.totalPages() }, (_, i) => i + 1);
    this.shownArrayPages = this.arrayPages.slice(this.pageNumber() - 1,  this.pageNumber() + 4);
    console.log('Updated arrayPages:', this.arrayPages);
  }  

  private searchSubject = new Subject<string>(); // Subject do obsługi debouncingu

  updateArrayPagesNew() {
    const total = this.totalPages();  // Łączna liczba stron
    const currentPage = this.pageNumber();  // Bieżąca strona
    const pagesToShow = 5; // Liczba stron do wyświetlenia na raz
    let startPage = currentPage - Math.floor(pagesToShow / 2);  // Określenie strony początkowej
    
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
  

  changePage(page: number) { 
    console.log('changePage', page);
    this.projectsService.page.update((prev: string) => page.toString());
    this.pageNumber.set(page)
    this.updateArrayPagesNew()
    this.fetchProjects();
  }
  prevFirstPage() {
    console.log('prevFirstPage');
    this.projectsService.page.update((prev: string) => '1');
    this.pageNumber.set(1)
    this.updateArrayPagesNew()
    this.fetchProjects()
  }
  prevPage() {
    console.log('prevPage');
    this.projectsService.page.update((prev: string) => (Number(prev) - 1).toString());
    this.pageNumber.update((prev: number) => prev - 1);
    this.updateArrayPagesNew()
    console.log(this.page());
    console.log(this.pageNumber)
    this.fetchProjects()
  }
  nextPage() { 
    console.log('nextPage');
    this.projectsService.page.update((prev: string) => (Number(prev) + 1).toString());
    console.log(this.page());
    this.pageNumber.update((prev: number) => prev + 1);
    this.updateArrayPagesNew()
    console.log(this.pageNumber)
    this.fetchProjects()
  }
  nextLastPage() {
    console.log('nextLastPage');
    this.projectsService.page.update((prev: string) => (this.arrayPages.length).toString());
    this.pageNumber.set(this.arrayPages.length)
    this.shownArrayPages = this.arrayPages.slice(this.pageNumber() - 1,  this.pageNumber() + 4);
    this.fetchProjects()
  }


  fetchProjects() {
    const filters = { title: this.searchQuery() };
    const sorts = this.sortOrder() === 'asc' ? 'likeCount' : '-likeCount';

    this.projectsService.getProjects(this.page(), this.pageSize(), filters, sorts).subscribe({
      next: (data: any) => {
        console.log(data);
        this.projectsService.updateProjects(data.items as Project[]);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement; 
    this.searchSubject.next(target.value); 
  }

  toggleSortOrder() {
    this.projectsService.sortOrder.update((prev: string) => prev === 'asc' ? 'desc' : 'asc');
    this.fetchProjects(); 
  }
}