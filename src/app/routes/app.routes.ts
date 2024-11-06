import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { ErrorComponent } from '../components/error/error.component';
import { RecycleComponent } from '../pages/recycle/recycle.component';
import { inject } from '@angular/core';
import { KeycloakService } from '../keycloak.service';

const isLoggedIn: CanMatchFn = (route, segments) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  if (keycloakService.profile()) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/home'));
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'recycle',
    component: RecycleComponent,
    loadChildren: () => import('./recycle.routes').then((m) => m.recycleRoutes),
    // canMatch: [isLoggedIn]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];