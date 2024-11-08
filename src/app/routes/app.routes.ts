import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { ErrorComponent } from '../components/error/error.component';
import { RecycleComponent } from '../pages/recycle/recycle.component';
import { inject } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../components/login/login.component';
import { LoginGuard } from '../guards/login.guard';
import { AlreadyLoggedGuard } from '../guards/alreadyLogged.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recycle',
    component: RecycleComponent,
    loadChildren: () => import('./recycle.routes').then((m) => m.recycleRoutes),
    canActivate: [LoginGuard],
    // canMatch: [isLoggedIn]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
