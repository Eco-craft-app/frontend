import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from './components/theme/theme.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { KeycloakOperationService } from './services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private keycloakService = inject(KeycloakOperationService);

  constructor() {
    // Usunięcie znacznika odświeżania podczas ładowania strony
    sessionStorage.removeItem('refresh');
  }

  ngOnInit() {
    setInterval(async () => {
      await this.keycloakService.updateToken();
      localStorage.setItem('userToken', JSON.stringify(await this.keycloakService.getUserTokens()));
    }, 3000)
  }

  // Ustawienie znacznika w `sessionStorage` przy odświeżaniu strony
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event): void {
    sessionStorage.setItem('refresh', 'true');
  }

  // Wykonywanie akcji tylko podczas zamknięcia okna
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event): void {
    const isRefreshing = sessionStorage.getItem('refresh') === 'true';

    // Jeśli nie jest to odświeżenie strony, wykonaj akcję
    if (!isRefreshing) {
      // Przykład: Usuwanie elementu z localStorage
      localStorage.removeItem('isProfileSet');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfoData');
    }
  }
}
