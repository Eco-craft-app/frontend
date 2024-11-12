import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class isProfileSet implements CanActivate {

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (JSON.parse(localStorage.getItem('isProfileSet')!)) {
      // console.log('User is logged in');
      return true;
    } else {
      const profileData = JSON.parse(localStorage.getItem('userInfoData')!);
      this.router.navigate(['/recycle', profileData.username, 'edit']);
      return false;
    }
  }
}