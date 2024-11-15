import { Routes } from "@angular/router";
import { RecycleMainComponent } from "../layouts/recycle-main/recycle-main.component";
import { RecycleUploadComponent } from "../layouts/recycle-upload/recycle-upload.component";
import { AuthGuard } from "../guards/auth.guard";
import { LoginGuard } from "../guards/login.guard";
import { RecycleUserEditComponent } from "../layouts/recycle-user-edit/recycle-user-edit.component";
import { isProfileSet } from "../guards/isProfileSet.guard";
import { RecycleUserProfileComponent } from "../layouts/recycle-user-profile/recycle-user-profile.component";
import { RecycleProjectInfoComponent } from "../layouts/recycle-project-info/recycle-project-info.component";
import { ChatComponent } from "../layouts/chat/chat.component";

export const recycleRoutes: Routes = [
  {
    path: '',
    component: RecycleMainComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [isProfileSet]
  },
  {
    path: 'upload',
    component: RecycleUploadComponent,
    canActivate: [isProfileSet]
  },
  {
    path: 'project/:id/edit',
    component: RecycleUploadComponent,
    canActivate: [isProfileSet]
  },
  {
    path: ':username/edit',
    component: RecycleUserEditComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'profile/:id',
    component: RecycleUserProfileComponent,
    canActivate: [isProfileSet],
    loadChildren: () => import('./user-projects.routes').then(m => m.routes)
  },
  {
    path: 'project/:id',
    component: RecycleProjectInfoComponent,
    loadChildren: () => import('./project-info.routes').then(m => m.routes)
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
]