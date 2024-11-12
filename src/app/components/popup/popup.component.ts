import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true
})
export class PopupComponent {
  isPopupVisible = false;

  constructor(private elementRef: ElementRef) {}

  togglePopup(event: MouseEvent) {
    this.isPopupVisible = !this.isPopupVisible;
    event.stopPropagation(); // Zatrzymujemy propagację, aby kliknięcie w przycisk nie zamykało popupu
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  // Metoda wykrywa kliknięcie w dowolne miejsce poza popupem
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closePopup();
    }
  }

  // Obsługa kliknięcia wewnątrz popupu, aby nie zamykać na kliknięcie w jego wnętrzu
  handlePopupClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
