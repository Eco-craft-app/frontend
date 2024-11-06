import { Component, inject, signal } from '@angular/core';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';


@Component({
  selector: 'app-recycle-upload',
  standalone: true,
  imports: [NgxDropzoneModule],
  templateUrl: './recycle-upload.component.html',
  styleUrl: './recycle-upload.component.scss',
})
export class RecycleUploadComponent {
  private cloudinaryService = inject(CloudinaryUploadService)
  files = signal<any>([]);
  myWidget: any;

  onSelect(event: NgxDropzoneChangeEvent) {
    console.log(event);
    this.files.update(files => [...files, ...event.addedFiles]);
  }
  onRemove(event: any) {
    console.log(event);
    this.files.update(files => files.filter((file: any) => file.name !== event.name));
  }

  uploadFiles() {
    if (!this.files().length) {
      alert('No files to upload');
    }
    for(let i = 0; i < this.files().length; i++) {
      const file_data = this.files()[i];
      console.log(this.files())
      console.log(file_data)
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'new-project')

      console.log([...(data as any).entries()]);

      this.cloudinaryService.uploadImage(data).subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      })

    }
  }
}
