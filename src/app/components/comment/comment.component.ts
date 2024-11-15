import { Component, input } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  commentData = input.required<Comment>();
}
