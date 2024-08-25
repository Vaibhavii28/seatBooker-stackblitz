import { Component } from '@angular/core';
import { Seat } from './seat.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seats: Seat[] = [];
  rows: number = 12; // Assuming 12 rows with 7 seats each
  seatsPerRow: number = 7;
  currentBookedSeats: Seat[] = [];
  totalSeats = 80;

  initialBookedSeatsIds = [1, 7, 57, 58, 60];

  constructor() {
    this.setupSeats();
    this.initialiseSeats();
  }

  customIncludes(array: number[], value: number): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true;
      }
    }
    return false;
  }

  initialiseSeats() {
    this.seats.forEach((seat) => {
      if (this.customIncludes(this.initialBookedSeatsIds, seat.id)) {
        seat.isBooked = true;
      }
    });
  }

  setupSeats() {
    let id = 1;
    for (let row = 1; row <= this.rows; row++) {
      for (let seatNumber = 1; seatNumber <= this.seatsPerRow; seatNumber++) {
        if (row === this.rows && seatNumber > 3) break; // Last row has only 3 seats
        this.seats.push({
          id: id++,
          row: row,
          number: seatNumber,
          isBooked: false,
        });
      }
    }
  }

  validateSeatRequest(requestedSeats: number) {
    if (requestedSeats > 7 || requestedSeats < 1) {
      alert('You can only book between 1 and 7 seats at a time.');
      return false;
    }
    const bookedSeats = this.seats.filter((seat) => seat.isBooked);
    if (requestedSeats > this.totalSeats - bookedSeats.length) {
      alert(`There are only ${this.totalSeats - bookedSeats.length} remaining`);
      return false;
    }
    return true;
  }

  bookSeats(requestedSeats: number) {
    this.currentBookedSeats = []; // Reset the booked seats for the current booking
    if (!this.validateSeatRequest(requestedSeats)) return;

    let seatsBooked = false;

    // 1. Try to find all requested seats in a single row
    for (let row = 1; row <= this.rows; row++) {
      let availableSeatsInRow = this.seats.filter(
        (seat) => seat.row === row && !seat.isBooked
      );
      if (availableSeatsInRow.length >= requestedSeats) {
        // Book all requested seats in this row
        let seatsToBook = availableSeatsInRow.slice(0, requestedSeats);
        seatsToBook.forEach((seat) => {
          seat.isBooked = true;
          this.currentBookedSeats.push(seat);
        });
        seatsBooked = true;
        break;
      }
    }

    // 2. If not all seats can be booked in a single row, find nearby seats
    if (!seatsBooked) {
      let availableSeats = this.seats.filter((seat) => !seat.isBooked);

      let seatsToBook = availableSeats.slice(0, requestedSeats);
      seatsToBook.forEach((seat) => {
        seat.isBooked = true;
        this.currentBookedSeats.push(seat);
      });
    }
  }
}
