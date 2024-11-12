import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-recycle-upload',
  standalone: true,
  imports: [NgxDropzoneModule, ReactiveFormsModule],
  templateUrl: './recycle-upload.component.html',
  styleUrl: './recycle-upload.component.scss',
})
export class RecycleUploadComponent {
  private cloudinaryService = inject(CloudinaryUploadService);
  private toastrService = inject(ToastrService);
  private httpClient = inject(HttpClient);
  files = signal<any>([]);
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  onAddProject() {
    console.log(this.form.valid);
    console.log(this.cloudinaryService.imagesInfo());
    if (this.cloudinaryService.imagesInfo().length === 0) {
      this.toastrService.error('Upload the images!', 'No images uploaded');
      return;
    }
    if (this.cloudinaryService.isWidgetOpen()) {
      this.toastrService.error(
        'Your widget is still open',
        'Upload the images!'
      );
      return;
    }
    if (this.form.invalid) {
      this.toastrService.error('Fill all the fields', 'Form invalid');
      return;
    }
    const projectData = {
      title: this.form.get('title')!.value,
      description: this.form.get('description')!.value,
      photos: this.cloudinaryService.imagesInfo(),
    };
    const token = JSON.parse(localStorage.getItem('userToken')!); // Zmienna przechowująca Twój Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // (opcjonalnie) w zależności od potrzeb API
    });
    console.log(token)
    console.log(JSON.stringify(projectData))
    try {
      this.httpClient
        .post('https://localhost:5001/api/projects', JSON.stringify(projectData), {headers})
        .subscribe((response) => {
          console.log(response);
          this.form.reset();
          this.cloudinaryService.imagesInfo.set([]);
          this.toastrService.success('Project added successfully', 'Success');
        });
    } catch (error) {
      this.toastrService.error(
        'An error while adding your project',
        'Error occured'
      );
    }
  }

  openWidget() {
    this.cloudinaryService.openWidget();
  }
}
