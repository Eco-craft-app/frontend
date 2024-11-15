import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class isSameUserGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    // Sprawdzenie wartości `isSameUser` z `UserService`
    if (this.userService.isSameUser()) {
      return true; // Pozwól przejść na stronę
    } else {
      // Nawiguj do innej strony, np. do strony logowania
      this.router.navigate(['/recycle']);
      return false; // Zablokuj dostęp
    }
  }
}
