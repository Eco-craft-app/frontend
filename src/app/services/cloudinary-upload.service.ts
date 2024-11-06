import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {

  constructor(private httpClient: HttpClient) { }

  uploadImage(vals: any) {
    let data = vals
    return this.httpClient.post('https://api.cloudinary.com/v1_1/recycle/image/upload', data)
  }
}
