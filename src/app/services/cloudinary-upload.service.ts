import { Injectable, signal } from '@angular/core';

declare global {
  interface Window {
    cloudinary: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  cloudinaryName = 'recycle'
  cloudinaryPreset = 'new-project'
  imagesInfo = signal<any>([])
  myWidget: any
  isWidgetOpen = signal<boolean>(false)

  openWidget() {
    console.log(this.imagesInfo())
    this.isWidgetOpen.set(true)
    this.myWidget = window.cloudinary.createUploadWidget({
      cloudName: this.cloudinaryName,
      uploadPreset: this.cloudinaryPreset
    }, (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        if (this.imagesInfo().length === 0) { 
          this.imagesInfo.update(prev => [...prev, { url: result.info.secure_url, isMain: true }])
        } else {
          this.imagesInfo.update(prev => [...prev, { url: result.info.secure_url, isMain: false }])
        }
        console.log(this.imagesInfo())
      }
      if (result.event === "success") {
        console.log("Użytkownik nacisnął przycisk 'Done'");
        console.log(this.imagesInfo())
      }
      if(result.event === "queues-end") { 
        console.log('All images uploaded')
        console.log(document.getElementById(''))
      }
      if (result.event === "close") {
        console.log("Użytkownik nacisnął przycisk 'Close'");
        this.isWidgetOpen.set(false)
        // this.imagesInfo.set([])
      }
    })
    this.myWidget.open()
  }
}
