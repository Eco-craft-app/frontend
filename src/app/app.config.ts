import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { KeycloakService } from './keycloak.service';

function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterConfig({
    paramsInheritanceStrategy: 'always'
  })),
  provideHttpClient(), HttpClient, 
  {
    provide: APP_INITIALIZER,
    deps: [KeycloakService],
    useFactory: () => () => Promise.resolve(), // No redirection to Keycloak on app load
    multi: true
  }]
};
