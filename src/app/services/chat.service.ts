import { inject, Injectable, signal } from '@angular/core';
import { ChatRes } from '../models/chat.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = 'http://eco-craft.duckdns.org:2024'
  private chatContent = signal<any[]>([]);
  private httpClient = inject(HttpClient);
  allChatContent = this.chatContent.asReadonly();
  trashContent = signal<any[]>([])
  binsUrls = signal<string[]>([])
  isUploading = signal<boolean>(false)
  isSubmitting = signal<boolean>(false)
  isGettingMoreInfo = signal<boolean>(false)
  descriptionInfo = signal<any | undefined>(undefined)

  private responseContent = signal<any | undefined>(undefined);
  allResponseContent = this.responseContent.asReadonly();

  postPhoto(url: string) {
    return this.httpClient.post(this.url + 'recycling_photo', { Photo_URL: url });
  }
  getMoreInfo() {
    const data = {
      Message: this.allResponseContent()
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    return this.httpClient.post(this.url + 'upcycling_text', JSON.stringify(data), {headers});
  }

  deleteChatContent() {
    this.chatContent.set([]);
    this.responseContent.set(undefined);
    this.descriptionInfo.set(undefined);
    this.binsUrls.set([]);
    this.trashContent.set([]);
  }
  updateAllResponseContent(content: ChatRes[]) {
    this.responseContent.set(content);
  }
  updateChatContent(content: any) {
    this.chatContent.update((chatContent) => [...chatContent, content]);
  }
}
