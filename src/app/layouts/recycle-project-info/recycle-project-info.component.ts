import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { ProjectInfo, ProjectInfoPhotos } from '../../models/project-info.model';
import { UserInfo } from '../../models/user-info.model';
import { DatePipe } from '@angular/common';
import { ShortenNumberPipe } from '../../pipes/shortenNumber.pipe';

@Component({
  selector: 'app-recycle-project-info',
  standalone: true,
  imports: [DatePipe, ShortenNumberPipe],
  templateUrl: './recycle-project-info.component.html',
  styleUrl: './recycle-project-info.component.scss'
})
export class RecycleProjectInfoComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private httpClient = inject(HttpClient)
  private projectsService = inject(ProjectsService)
  private destroyRey = inject(DestroyRef)
  projectInfo = signal<undefined | ProjectInfo>(undefined)
  userInfo = signal<undefined | UserInfo>(undefined)
  photos = signal<ProjectInfoPhotos[]>([])
  actualPhoto = signal<string>('')
  id = input.required<string>();

  ngOnInit() {
    console.log(this.id());
    const sub = this.projectsService.getProjectById(this.id()).subscribe({
      next: (project) => {
        this.projectInfo.set(project as ProjectInfo);
        this.photos.set(this.projectInfo()!.photos);
        this.actualPhoto.set(this.photos().find(photo => photo.isMain)!.url);
        console.log(this.photos());
        console.log(this.projectInfo());
        this.httpClient.get(`https://localhost:5001/api/users/${this.projectInfo()!.userId}`).subscribe({
          next: (user) => {
            this.userInfo.set(user as UserInfo);
          }
        })
      }
    })

    this.destroyRey.onDestroy(() => {
      sub.unsubscribe();
    })
  }
  nextPhoto() {
    const index = this.photos().findIndex(photo => photo.url === this.actualPhoto());
    if (index === this.photos().length - 1) {
      this.actualPhoto.set(this.photos()[0].url);
    } else {
      this.actualPhoto.set(this.photos()[index + 1].url);
    }
  }
  previousPhoto() {
    const index = this.photos().findIndex(photo => photo.url === this.actualPhoto());
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
}
