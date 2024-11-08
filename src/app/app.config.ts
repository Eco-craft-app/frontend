import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './routes/app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { KeycloakService, KeycloakBearerInterceptor } from "keycloak-angular";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { initializeKeycloak } from "./init/keycloak-init.factory";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    provideHttpClient(),
    HttpClient,
    provideAnimationsAsync(),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    }, provideAnimationsAsync(),
  ],
};
