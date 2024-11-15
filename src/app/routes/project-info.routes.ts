import { Routes } from "@angular/router";
import { ProjectDescriptionComponent } from "../components/project-description/project-description.component";
import { ProjectCommentsComponent } from "../components/project-comments/project-comments.component";
import { isProfileSet } from "../guards/isProfileSet.guard";

export const routes: Routes = [
  {
    path: 'description',
    component: ProjectDescriptionComponent
  },
  {
    path: 'comments',
    component: ProjectCommentsComponent,
  }
]