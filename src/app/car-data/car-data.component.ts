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
  cars: any[] = [];
  paginatedCars: any[] = [];
  currentPage: number = 1;
  carsPerPage: number = 20;
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadSearchTerm();
    this.loadCars();
  }

  loadCars() {
    const carsCollection = collection(this.firestore, 'cars');
    collectionData(carsCollection, { idField: 'id' }).subscribe(
      (cars: any[]) => {
        this.cars = cars;
        this.updatePaginatedCars();
      }
    );
  }

  
  updatePaginatedCars() {
    const filteredCars = this.cars.filter((car) =>
      car.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.carsPerPage;
    const end = this.currentPage * this.carsPerPage;
    this.paginatedCars = filteredCars.slice(start, end);
  }


  nextPage() {
    if (this.currentPage * this.carsPerPage < this.cars.length) {
      this.currentPage++;
      this.updatePaginatedCars();
    }
  }

 
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCars();
    }
  }

  
  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1; 
    this.updatePaginatedCars();
    this.saveSearchTerm(); // Save the search term to localStorage
  }

  // Save search term to localStorage
  saveSearchTerm() {
    localStorage.setItem('searchTerm', this.searchTerm);
  }

  // Load search term from localStorage
  loadSearchTerm() {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      this.searchTerm = storedSearchTerm;
    }
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
