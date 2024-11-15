import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ChatService } from './chat.service';
import { ToastrService } from 'ngx-toastr';

declare global {
  interface Window {
    cloudinary: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  private chatService = inject(ChatService)
  private httpClient = inject(HttpClient)
  private toastrService = inject(ToastrService)

  cloudinaryName = 'recycle'
  cloudinaryPreset = 'new-project'
  imagesInfo = signal<any>([])
  myWidget: any
  isWidgetOpen = signal<boolean>(false)
  chatImageInfo = signal<string>('')

  openWidget() {
    console.log(this.imagesInfo())
    this.isWidgetOpen.set(true)
    this.myWidget = window.cloudinary.createUploadWidget({
      cloudName: this.cloudinaryName,
      uploadPreset: this.cloudinaryPreset,
      ultiple: false,             // Wyłącza możliwość wyboru wielu plików
      maxFiles: 1,                 // Ogranicza do jednego zdjęcia
      singleUploadAutoClose: true, // Automatyczne zamykanie po przesłaniu
      showUploadMoreButton: false
    }, (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        this.chatImageInfo.set(result.info.secure_url)
      }
      if (result.event === "success") {
        this.chatService.deleteChatContent()
        console.log("Użytkownik nacisnął przycisk 'Done'");
        console.log(this.chatImageInfo())
        this.chatService.isUploading.set(true)
        this.chatService.isSubmitting.set(true)
        const sub = this.chatService.postPhoto(this.chatImageInfo()).subscribe({
          next: (res: any) => {
            console.log(res.response)
            this.chatService.updateAllResponseContent(res.response)
            console.log(Object.keys(res.bins))
            const urls = Object.keys(res.bins)
            this.chatService.updateChatContent(res.response)
            this.chatService.isUploading.set(false)
            this.chatService.isSubmitting.set(false)
            this.chatService.trashContent.set([])
            urls.forEach((url) => {
              this.chatService.trashContent.update((trashContent) => [...trashContent, res.bins[url]])
            });
            console.log(this.chatService.trashContent())
            this.chatService.binsUrls.set(Object.keys(res.bins))
          }, error: (err: any) => {
            this.chatService.isUploading.set(false)
            this.toastrService.error('Wystąpił błąd podczas pobierania informacji.')
          }
        })
        this.chatService.updateChatContent({Photo_URL: this.chatImageInfo()})
        
      }
      if(result.event === "queues-end") { 
        console.log('All images uploaded')
      }
      if (result.event === "close") {
        console.log("Użytkownik nacisnął przycisk 'Close'");
        this.isWidgetOpen.set(false)
        // this.imagesInfo.set([])
      }
    })
    this.myWidget.open()
  }


  async uploadImage(vals: any) {
    let data = vals
    return await this.httpClient.post('https://api.cloudinary.com/v1_1/recycle/image/upload', data)
  }
}
