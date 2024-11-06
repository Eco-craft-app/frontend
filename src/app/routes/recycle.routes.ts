import { Routes } from "@angular/router";
import { RecycleMainComponent } from "../layouts/recycle-main/recycle-main.component";
import { RecycleUploadComponent } from "../layouts/recycle-upload/recycle-upload.component";

export const recycleRoutes: Routes = [
  {
    path: '',
    component: RecycleMainComponent
  },
  {
    path: 'upload',
    component: RecycleUploadComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'prefix'
  }
]