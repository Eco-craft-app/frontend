import { Routes } from "@angular/router";
import { RecycleMainComponent } from "../layouts/recycle-main/recycle-main.component";
import { RecycleUploadComponent } from "../layouts/recycle-upload/recycle-upload.component";
import { AuthGuard } from "../guards/auth.guard";
import { LoginGuard } from "../guards/login.guard";

export const recycleRoutes: Routes = [
  {
    path: '',
    component: RecycleMainComponent
  },
  {
    path: 'upload',
    component: RecycleUploadComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'prefix'
  }
]