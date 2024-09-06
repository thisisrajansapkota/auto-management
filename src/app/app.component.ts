import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarDataComponent } from './car-data/car-data.component';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarDataComponent, UploadCsvComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Auto Management';
}
