import { Component, computed, inject, signal } from '@angular/core';

import { PrimaryNavComponent } from '../../components/primary-nav/primary-nav.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { UserService } from '../../services/user.service';
import { UserKeycloakProfile } from '../../models/user-keycloak-profile.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [PrimaryNavComponent, RouterOutlet, RouterLink],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.scss',
})
export class RecycleComponent {
  private keycloakService = inject(KeycloakOperationService);
  private userService = inject(UserService);
  private router = inject(Router);
  userHaveSetProfile = signal<boolean>(true);
  isProfileSet = computed(() => this.userService.haveSetProfile());
  isLoggedIn = computed(() => this.keycloakService.isLoggedIn());

  userData = signal<undefined | any>(undefined);

  async ngOnInit() {
    if (!this.keycloakService.isLoggedIn()) {
      return;
    }
    this.userData.set(await this.keycloakService.getUserDatas());

    try {
      const isProfileSetJSON = localStorage.getItem('isProfileSet');

      let isProfileSet;
      if (isProfileSetJSON) {
        isProfileSet = JSON.parse(isProfileSetJSON);
        this.userHaveSetProfile.set(isProfileSet);
        this.userService.haveSetProfile.set(isProfileSet);

        if (isProfileSet) {
          const token = await this.keycloakService.getUserTokens();
          localStorage.setItem('userToken', JSON.stringify(token));
          this.userService.userInfo.set(
            (await this.keycloakService.getUserProfile()) as UserKeycloakProfile
          );
          localStorage.setItem(
            'userInfoData',
            JSON.stringify(this.userService.userInfo())
          );
          return;
        } else {
          const token = await this.keycloakService.getUserTokens();
          localStorage.setItem('userToken', JSON.stringify(token));
          this.userService.userInfo.set(
            (await this.keycloakService.getUserProfile()) as UserKeycloakProfile
          );
          localStorage.setItem(
            'userInfoData',
            JSON.stringify(this.userService.userInfo())
          );
          // this.router.navigate([
          //   `recycle/${this.userService.userInfo()!.username}/edit`,
          // ]);
          return;
        }
      }
      const token = await this.keycloakService.getUserTokens();
      localStorage.setItem('userToken', JSON.stringify(token));
      this.userData.set(await this.keycloakService.getUserDatas());
      this.userService.userInfo.set(
        (await this.keycloakService.getUserProfile()) as UserKeycloakProfile
      );
      localStorage.setItem(
        'userInfoData',
        JSON.stringify(this.userService.userInfo())
      );
      this.userService.getUserProfile(this.userData().profile.id).subscribe({
        next: (data: any) => {
          localStorage.setItem('isProfileSet', JSON.stringify(true));
        },
        error: (err: any) => {
          this.userService.haveSetProfile.set(false);
          localStorage.setItem('isProfileSet', JSON.stringify(false));
          // setTimeout(() => {
          //   this.router.navigate([
          //     `recycle/${this.userService.userInfo()!.username}/edit`,
          //   ]);
          // }, 300);
        },
      });
    } catch (err) {}
  }
}
