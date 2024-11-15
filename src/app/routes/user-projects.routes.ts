import { Routes } from "@angular/router";
import { isProfileSet } from "../guards/isProfileSet.guard";
import { UserProjectsComponent } from "../components/user-projects/user-projects.component";
import { UserLikedProjectsComponent } from "../components/user-liked-projects/user-liked-projects.component";
import { isSameUserGuard } from "../guards/isSameUser.guard";



export const routes: Routes = [
  {
    path: 'projects',
    component: UserProjectsComponent,
    canActivate: [isProfileSet]
  },
  {
    path: 'liked',
    component: UserLikedProjectsComponent,
    canActivate: [isProfileSet, isSameUserGuard]
  }
]