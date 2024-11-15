import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { ProjectInfo } from '../../models/project-info.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recycle-upload',
  standalone: true,
  imports: [NgxDropzoneModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recycle-upload.component.html',
  styleUrl: './recycle-upload.component.scss',
})
export class RecycleUploadComponent {
  private cloudinaryService = inject(CloudinaryUploadService);
  private toastrService = inject(ToastrService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private projectsService = inject(ProjectsService);
  id = input<string>();
  dropZoneFiles = signal<any>([]);
  cloudinaryFilesToUpload = signal<any>([]);
  cloudinaryFiles = signal<any>([]);
  isSubmitting = signal<boolean>(false);
  files = signal<any>([]);
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    if (this.id()) {
      const sub = this.projectsService.getProjectById(this.id()!).subscribe({
        next: (data) => {
          const projectData = data as ProjectInfo;
          this.form.get('title')!.setValue(projectData.title);
          this.form.get('description')!.setValue(projectData.description);
          this.cloudinaryFiles.set(projectData.photos);
        },
        error: (err) => {},
      });
    }
  }

  async onAddProject() {
    if (this.dropZoneFiles().length === 0) {
      this.toastrService.error('Prześlij zdjęcia!', 'Brak zdjęć');
      return;
    }
    if (this.form.invalid) {
      this.toastrService.error('Wypełnij wszystkie pola', 'Błąd');
      return;
    }
    this.isSubmitting.set(true);
    const files = await this.uploadFiles();

    const projectData = {
      title: this.form.get('title')!.value,
      description: this.form.get('description')!.value,
      photos: files,
    };
    const token = JSON.parse(localStorage.getItem('userToken')!); // Zmienna przechowująca Twój Bearer Token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });
    try {
      this.httpClient
        .post(
          'https://eco-craft.duckdns.org:2001/api/projects',
          JSON.stringify(projectData),
          { headers }
        )
        .subscribe({
          next: (response) => {
            this.form.reset();
            this.cloudinaryService.imagesInfo.set([]);
            this.dropZoneFiles.set([]);
            this.cloudinaryFilesToUpload.set([]);
            this.cloudinaryFiles.set([]);
            this.toastrService.success('Projekt dodany pomyślnie', 'Sukces');
          },
          error: (err) => {
            this.toastrService.error(
              'Wystąpił błąd podczas dodawania projektu',
              'Wystąpił błąd'
            );
          },
          complete: () => {
            this.isSubmitting.set(false);
          },
        });
    } catch (error) {
      this.toastrService.error(
        'Wystąpił błąd podczas dodawania projektu',
        'Wystąpił błąd'
      );
    }
  }

  openWidget() {
    this.cloudinaryService.openWidget();
  }

  myWidget: any;

  onSelect(event: NgxDropzoneChangeEvent) {
    this.cloudinaryFilesToUpload.update((files) => [
      ...files,
      ...event.addedFiles,
    ]);
    const addedFiles = event.addedFiles.map((file: File) => {
      const newFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };

      return {
        ...newFile,
        url: URL.createObjectURL(file),
      };
    });

    if (this.id()) {
      this.cloudinaryFiles.update((files) => [...files, ...addedFiles]);
    }
    this.dropZoneFiles.update((files) => [...files, ...addedFiles]);
  }
  onRemove(event: any) {
    if (this.id()) {
      this.cloudinaryFiles.update((files) =>
        files.filter((file: any) => {
          if (file.url !== event.url) {
            return true;
          } else if (file.name !== event.name) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
    this.dropZoneFiles.update((files) =>
      files.filter((file: any) => file.name !== event.name)
    );
    this.cloudinaryFilesToUpload.update((files) =>
      files.filter((file: any) => file.name !== event.name)
    );
  }
  async uploadFiles() {
    if (!this.dropZoneFiles().length) {
      alert('No files to upload');
    }
    const uploadPromises = this.cloudinaryFilesToUpload().map(
      (file_data: File, index: number) => {
        const data = new FormData();

        data.append('file', file_data);
        data.append('upload_preset', 'new-project');

        return new Promise(async (resolve, reject) => {
          const sub = (
            await this.cloudinaryService.uploadImage(data)
          ).subscribe({
            next: (data: any) => {
              let i = index;

              let uploadedFile;

              if (this.id()) {
                i = this.cloudinaryFiles().length;
              }
              if (i === 0) {
                uploadedFile = {
                  url: data.url,
                  isMain: true,
                };
              } else {
                uploadedFile = {
                  url: data.url,
                  isMain: false,
                };
              }

              // Aktualizacja listy cloudinaryFiles
              this.cloudinaryFiles.update((files) => [...files, uploadedFile]);
              this.cloudinaryFiles.update((files) =>
                files.filter((f: any) => f.name === undefined)
              );
              resolve(uploadedFile);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              sub.unsubscribe();
            },
          });

          this.destroyRef.onDestroy(() => {
            sub.unsubscribe();
          });
        });
      }
    );

    // Oczekiwanie na wszystkie przesyłki
    await Promise.all(uploadPromises);

    // Zwrócenie listy plików
    return this.cloudinaryFiles();
  }

  async editProject() {
    if (this.dropZoneFiles().length === 0) {
      this.toastrService.error('Prześlij zdjęcia!', 'Brak zdjęć');
      return;
    }
    if (this.form.invalid) {
      this.toastrService.error('Wypełnij wszystkie pola', 'Błąd');
      return;
    }
    this.isSubmitting.set(true);
    const files = await this.uploadFiles();

    const projectData = {
      title: this.form.get('title')!.value,
      description: this.form.get('description')!.value,
      photos: files,
    };

    const token = JSON.parse(localStorage.getItem('userToken')!); // Zmienna przechowująca Twój Bearer Token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });
    try {
      this.httpClient
        .put(
          `https://eco-craft.duckdns.org:2001/api/projects/${this.id()}`,
          JSON.stringify(projectData),
          { headers }
        )
        .subscribe({
          next: (response) => {
            // this.form.reset();
            this.cloudinaryService.imagesInfo.set([]);
            this.dropZoneFiles.set([]);
            this.cloudinaryFilesToUpload.set([]);
            // this.cloudinaryFiles.set([]);
            this.toastrService.success(
              'Projekt zaktualizowany pomyślnie',
              'Success'
            );
          },
          error: (err) => {
            this.toastrService.error(
              'Wystąpił błąd podczas aktualizacji projektu',
              'Wystąpił błąd'
            );
          },
          complete: () => {
            this.isSubmitting.set(false);
          },
        });
    } catch (error) {
      this.toastrService.error(
        'Wystąpił błąd podczas aktualizacji projektu',
        'Wystąpił błąd'
      );
    }
  }
}
