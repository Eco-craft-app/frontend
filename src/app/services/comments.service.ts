import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { KeycloakOperationService } from './keycloak.service';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private keycloakService = inject(KeycloakOperationService);
  private toastrService = inject(ToastrService);
  private comments = signal<Comment[]>([]);
  private httpClient = inject(HttpClient);
  page = signal<string>('1');
  pageSize = signal<string>('5');
  allComments = this.comments.asReadonly();
  isLoggedIn = this.keycloakService.isLoggedIn();
  isProfileSet = localStorage.getItem('isProfileSet')

  url = 'https://localhost:5001/api/projects/'

  updateComments(comment: Comment) {
    this.comments.update((comments) => [...comments, comment])
  }

  updateAllComments(comments: Comment[]) {
    this.comments.set(comments)
  }

  getComments(projectId: string) {
    let params = new HttpParams().set('page', this.page()).set('pageSize', this.pageSize());
    const token = localStorage.getItem('userToken')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token!)}`
    };
    return this.httpClient.get(`${this.url}${projectId}/comments`, {params, headers})
  }

  deleteComment(projectId: string, commentId: string) {
    const token = localStorage.getItem('userToken')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token!)}` // Include your auth token
    };
    return this.httpClient.delete(`${this.url}${projectId}/comments/${commentId}`, {headers})
  }

  addComment(comment: string, projectId: string) {
    // const isProfileSet = JSON.parse(isProfileSetJSON!)
    console.log('isLoggedIn ' + this.isLoggedIn)
    console.log('isProfileSet ' + this.isProfileSet)
    if(!this.isLoggedIn) {
      this.toastrService.warning('Please login before commenting')
      return
    }
    if (!this.isProfileSet && this.isLoggedIn) {
      this.toastrService.warning('Please set your profile before commenting')
      return
    }

    const commentData = {
      content: comment
    }

    const token = localStorage.getItem('userToken')
    console.log(JSON.parse(token!))
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token!)}` // Include your auth token
    };
    return this.httpClient.post(`${this.url}${projectId}/comments`, commentData, {headers})
  }

  constructor() { }
}
