import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-car-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-data.component.html',
  styleUrls: ['./car-data.component.css'],
})
export class CarDataComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  cars: any[] = []; // All car data
  paginatedCars: any[] = []; // Cars for the current page
  currentPage: number = 1;
  carsPerPage: number = 20;
  searchTerm: string = ''; // Search term

  ngOnInit(): void {
    this.loadCars();
  }

  // Load all cars data from Firestore
  loadCars() {
    const carsCollection = collection(this.firestore, 'cars');
    collectionData(carsCollection, { idField: 'id' }).subscribe(
      (cars: any[]) => {
        this.cars = cars;
        this.updatePaginatedCars();
      }
    );
  }

  // Update the list of cars to show for the current page based on search term
  updatePaginatedCars() {
    const filteredCars = this.cars.filter((car) =>
      car.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.carsPerPage;
    const end = this.currentPage * this.carsPerPage;
    this.paginatedCars = filteredCars.slice(start, end);
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage * this.carsPerPage < this.cars.length) {
      this.currentPage++;
      this.updatePaginatedCars();
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCars();
    }
  }

  // Handle search input change
  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1; // Reset to first page when search term changes
    this.updatePaginatedCars();
  }

  // Download search results as CSV
  downloadCSV() {
    const filteredCars = this.cars.filter((car) =>
      car.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const csv = Papa.unparse(filteredCars);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cars.csv');
  }
}
