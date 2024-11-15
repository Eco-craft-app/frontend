import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectsService } from '../../services/projects.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../services/comments.service';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../models/user-info.model';
import { ToastrService } from 'ngx-toastr';
import { isProfileSet } from '../../guards/isProfileSet.guard';
import { Comment } from '../../models/comment.model';
import { CommentComponent } from '../comment/comment.component';
import { ProjectInfoService } from '../../services/project-info.service';
import { KeycloakOperationService } from '../../services/keycloak.service';

@Component({
  selector: 'app-project-comments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CommentComponent],
  templateUrl: './project-comments.component.html',
  styleUrl: './project-comments.component.scss',
})
export class ProjectCommentsComponent {
  private commentsService = inject(CommentsService);
  private projectInfoService = inject(ProjectInfoService);
  private keycloakService = inject(KeycloakOperationService);
  private projectsService = inject(ProjectsService);
  private userService = inject(UserService);
  private toastrService = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  comments = computed(() => this.commentsService.allComments());
  project = computed(() => this.projectInfoService.publicProjectInfo());
  id = input.required<string>();
  userInfo = signal<undefined | UserInfo>(undefined);
  isLoggedIn = this.keycloakService.isLoggedIn();
  isProfileSet = localStorage.getItem('isProfileSet') === 'true';
  charCount = signal<number>(0);
  maxChars = 500;
  totalPages = computed(() => this.commentsService.totalPages());
  page = computed(() => Number(this.commentsService.page()));

  form = new FormGroup({
    comment: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.maxChars),
    ]),
  });

  ngAfterViewInit() {
    if (!this.isProfileSet) {
      this.form.get('comment')?.disable();
    }
  }

  onAddAnotherComments() {
    this.commentsService.page.set(
      (+this.commentsService.page() + 1).toString()
    );
    this.commentsService.getComments(this.id()).subscribe({
      next: (comments) => {
        const commentsData = comments as {
          items: Comment[];
          totalPages: number;
        };
        this.commentsService.updateCommentsData(
          commentsData.items as Comment[]
        );
        this.commentsService.totalPages.set(commentsData.totalPages);
      },
    });
    window.scrollTo(0, window.innerHeight);
  }

  ngOnInit() {
    if (this.isProfileSet) {
      const sub = this.userService
        .getUserProfile(JSON.parse(localStorage.getItem('userInfoData')!).id)
        .subscribe({
          next: (data) => {
            this.userInfo.set(data as UserInfo);
          },
        });
    }
    const sub2 = this.commentsService.getComments(this.id()).subscribe({
      next: (comments) => {
        const commentsData = comments as {
          items: Comment[];
          totalPages: number;
        };
        this.commentsService.updateAllComments(commentsData.items as Comment[]);
        this.commentsService.totalPages.set(commentsData.totalPages);
      },
    });
  }

  onAddComment() {
    if (this.form.invalid) {
      this.toastrService.error('Please enter a comment');
      return;
    }

    this.commentsService
      .addComment(this.form.value.comment!, this.id())
      ?.subscribe({
        next: (commentData) => {
          this.commentsService.updateComments(
            (commentData as { value: Comment }).value
          );
          this.toastrService.success('Comment added successfully');
          this.form.reset();
        },
      });
  }

  onInput(): void {
    const text = this.form.get('comment')?.value || '';
    this.charCount.set(text.length);
  }
}
