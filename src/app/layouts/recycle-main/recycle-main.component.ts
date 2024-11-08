import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-recycle-main',
  standalone: true,
  imports: [],
  templateUrl: './recycle-main.component.html',
  styleUrl: './recycle-main.component.scss'
})
export class RecycleMainComponent {
  private httpClient = inject(HttpClient);
  ngOnInit() {
    this.httpClient.get('https://localhost:5001/api/projects?page=1&pageSize=5').subscribe((response) => {
      console.log(response);
    });
  }
}
