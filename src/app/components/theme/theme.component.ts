import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
  isDarkMode = signal<boolean>(false)
  constructor() {
    const isDarkMode = localStorage.getItem('isDarkMode')
    if(!isDarkMode) {
      return
    }
    this.isDarkMode.set(JSON.parse(isDarkMode))
    document.body.setAttribute('data-theme', JSON.parse(isDarkMode) ? 'dark' : 'light')
  }

  toggleTheme = () => {
    if(this.isDarkMode()) {
      this.isDarkMode.set(false)
      localStorage.setItem('isDarkMode', JSON.stringify(false))
      document.body.setAttribute('data-theme', 'light')
    } else {
      this.isDarkMode.set(true)
      localStorage.setItem('isDarkMode', JSON.stringify(true))
      document.body.setAttribute('data-theme', 'dark')
    }
  }
}
