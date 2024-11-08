import { Component, inject, signal } from '@angular/core';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';


@Component({
  selector: 'app-recycle-upload',
  standalone: true,
  imports: [NgxDropzoneModule, ReactiveFormsModule],
  templateUrl: './recycle-upload.component.html',
  styleUrl: './recycle-upload.component.scss',
})
export class RecycleUploadComponent {
  private cloudinaryService = inject(CloudinaryUploadService)
  files = signal<any>([]);
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  onAddProject() {
    if(this.cloudinaryService.imagesInfo().length === 0) {
      alert('Upload at least one image');
      return;
    }
    
    console.log(this.form.value);
    console.log(this.cloudinaryService.imagesInfo())
  }

  openWidget() {
    this.cloudinaryService.openWidget()
  }
}
