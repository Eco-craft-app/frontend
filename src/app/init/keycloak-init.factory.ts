import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://eco-craft-auth-keycloak.duckdns.org/',
        realm: 'recycle-app',
        clientId: 'public-client',
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets'],
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
        //   'http://localhost:4200/recycle'
          window.location.origin + '/assets/silent-check-sso.html',
        // redirectUri: 'http://localhost:4200/recycle',
      },
    });
}