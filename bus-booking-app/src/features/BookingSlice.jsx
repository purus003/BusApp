import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSeatsByBus: JSON.parse(sessionStorage.getItem("selectedSeats")) || {},
  bookings: JSON.parse(localStorage.getItem("bookings")) || [],
};

const BookingSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
  addSeat: (state, action) => {
  const { busId, seats } = action.payload;
  state.selectedSeatsByBus[busId] = seats;
  sessionStorage.setItem("selectedSeats", JSON.stringify(state.selectedSeatsByBus));
   },
  
  removeSeat: (state, action) => {
     const { busId, seat } = action.payload;
    if (state.selectedSeatsByBus[busId]) {
       state.selectedSeatsByBus[busId] = state.selectedSeatsByBus[busId].filter((s) => s !== seat);
      sessionStorage.setItem("selectedSeats", JSON.stringify(state.selectedSeatsByBus));
      }
    },

 booking: (state, action) => {
  const { busId, seat, passengerDetails, from, to, date, userId, totalFare, time,paymentMode } = action.payload;
  const now = new Date();
  const today = now.toISOString().split("T")[0];   
  const todayTime = now.toTimeString().slice(0, 5);  
  const bookingDate = date || today;
  const bookingTime = time || todayTime;
  const newBooking = {
    id: state.bookings.length + 1,
    busId,
    seat,
    passengerDetails,
    from,
    to,
    userId,
    totalFare,
    date: bookingDate,    
    time: bookingTime, 
    paymentMode,  
  };
  state.bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(state.bookings));
}
,

removeBooking: (state, action) =>{
  state.bookings = state.bookings.filter((b) =>
   b.id !== action.payload)
  localStorage.setItem("bookings", JSON.stringify(state.bookings));
}
  }
});

export const { addSeat, removeSeat, booking,removeBooking } = BookingSlice.actions;
export default BookingSlice.reducer;
