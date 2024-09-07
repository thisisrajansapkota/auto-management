import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css'],
})
export class UploadCsvComponent {
  selectedFile: File | null = null;
  parsedData: any[] = [];
  firestore: Firestore = inject(Firestore);

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.parseCSV();
    }
  }

  parseCSV(): void {
    if (!this.selectedFile) return;

    Papa.parse(this.selectedFile, {
      header: true,
      complete: (result) => {
        this.parsedData = result.data;
        console.log('Parsed Data:', this.parsedData);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }

  async uploadToFirestore(): Promise<void> {
    if (this.parsedData.length > 0) {
      const carsCollection = collection(this.firestore, 'cars');
      for (const row of this.parsedData) {
        try {
          await addDoc(carsCollection, row);
          console.log('Data added to Firestore:', row);
        } catch (error) {
          console.error('Error adding document:', error);
        }
      }
      // Show success toast
      this.showSuccessToast();
    } else {
      console.log('No data to upload');
    }
  }

  showSuccessToast() {
    Toastify({
      text: 'File uploaded successfully!',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      className: 'info',
      duration: 1000,
    }).showToast();
  }
}
