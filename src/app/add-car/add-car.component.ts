import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent {
  firestore: Firestore = inject(Firestore);

  // Model to hold car data
  car = {
    name: '',
    mpg: '',
    cylinders: '',
    displacement: '',
    horsepower: '',
    weight: '',
    acceleration: '',
    model_year: '',
    origin: '',
  };

  // Method to add a new car
  async addCar() {
    try {
      const carsCollection = collection(this.firestore, 'cars');
      await addDoc(carsCollection, this.car);
      this.showSuccessToast('Car added successfully!');

      // Clear the form after submission
      this.car = {
        name: '',
        mpg: '',
        cylinders: '',
        displacement: '',
        horsepower: '',
        weight: '',
        acceleration: '',
        model_year: '',
        origin: '',
      };
    } catch (error) {
      this.showErrorToast('Failed to add car. Please try again.');
    }
  }

  // Success Toast
  showSuccessToast(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top', // top or bottom
      position: 'right', // left, center or right
      backgroundColor: '#28a745',
      stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
  }

  // Error Toast
  showErrorToast(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#dc3545',
      stopOnFocus: true,
    }).showToast();
  }
}
