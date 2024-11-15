import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Chat, ChatRes } from '../../models/chat.model';
import { ChatContentComponent } from '../../components/chat-content/chat-content.component';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChatContentComponent, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private cloudinaryService = inject(CloudinaryUploadService);
  private destroyRef = inject(DestroyRef);
  private chatService = inject(ChatService);
  chatImageInfo = computed(() => this.cloudinaryService.chatImageInfo());
  chatContent = computed(() => this.chatService.allChatContent());
  isUploading = computed(() => this.chatService.isUploading());

  openWidget() {
    this.cloudinaryService.openWidget();
  }

  dummyBotContent: ChatRes = {
    bin: 'Plastik i metal',
    details: {
      material: 'plastik',
      size: 'średnie',
      variety: 'różne kolory',
    },
    explanation: 'Wrzuć do pojemnika na plastik i metal.',
    item: 'plastikowa butelka',
  };
  dummyUserContent: Chat = {
    Photo_URL:
      'https://res.cloudinary.com/recycle/image/upload/v1730827515/cld-sample-2.jpg',
  };

  onInput(event: any) {
    const target = event.target as HTMLInputElement;
    console.log(target);
    console.log(target.value);
    console.log(target.files);
    this.uploadFiles(target.files![0]);
  }

  async uploadFiles(file: File) {
    const data = new FormData();
    console.log(file);
    data.append('file', file);
    data.append('upload_preset', 'new-project');
    console.log(data);

    return new Promise(async (resolve, reject) => {
      const sub = (await this.cloudinaryService.uploadImage(data)).subscribe({
        next: (data: any) => {
          console.log(data);
          let uploadedFile;

          // Aktualizacja listy cloudinaryFiles
          resolve(uploadedFile);
        },
        error: (err: any) => {
          console.log(err);
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
}
