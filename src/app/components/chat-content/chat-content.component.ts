import { Component, computed, inject, input, signal } from '@angular/core';
import { Chat, ChatRes } from '../../models/chat.model';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss'
})
export class ChatContentComponent {
  private chatService = inject(ChatService);
  message = input.required<Chat | ChatRes>({});
  userMessage = signal<Chat | undefined>(undefined);
  botMessage = signal<any | undefined>(undefined);
  isUserMessage = signal<boolean>(true)
  binUrls = computed(() => this.chatService.binsUrls())
  trashBins = computed(() => this.chatService.trashContent())
  isUploading = computed(() => this.chatService.isUploading())
  isSubmitting = computed(() => this.chatService.isSubmitting())
  isGettingMoreInfo = computed(() => this.chatService.isGettingMoreInfo()) 
  descriptionInfo = computed(() => this.chatService.descriptionInfo())

  ngOnInit() {
    console.log(this.binUrls())
    console.log(this.trashBins())
    const message = this.message();
    if ('Photo_URL' in message) {
      this.userMessage.set(message)
      this.isUserMessage.set(true)
    } else {
      this.botMessage.set(message)
      this.isUserMessage.set(false)
    }
  }

  showAllInfo() {
    this.chatService.isGettingMoreInfo.set(true)
    this.chatService.getMoreInfo().subscribe({
      next: (res: any) => {
        console.log(res)
        this.chatService.descriptionInfo.set(res.response)
      }, error: (err: any) => {
        this.chatService.isGettingMoreInfo.set(false)
      },
      complete: () => {
        this.chatService.isGettingMoreInfo.set(false)
      }
    })
  }
}
