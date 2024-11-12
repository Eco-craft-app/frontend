import { Routes } from "@angular/router";
import { RecycleMainComponent } from "../layouts/recycle-main/recycle-main.component";
import { RecycleUploadComponent } from "../layouts/recycle-upload/recycle-upload.component";
import { AuthGuard } from "../guards/auth.guard";
import { LoginGuard } from "../guards/login.guard";
import { RecycleUserEditComponent } from "../layouts/recycle-user-edit/recycle-user-edit.component";
import { isProfileSet } from "../guards/isProfileSet.guard";
import { RecycleUserProfileComponent } from "../layouts/recycle-user-profile/recycle-user-profile.component";
import { RecycleProjectInfoComponent } from "../layouts/recycle-project-info/recycle-project-info.component";

export const recycleRoutes: Routes = [
  {
    path: '',
    component: RecycleMainComponent
  },
  {
    path: 'upload',
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
    canActivate: [isProfileSet]
  },
  {
    path: 'project/:id',
    component: RecycleProjectInfoComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'prefix'
  }
]