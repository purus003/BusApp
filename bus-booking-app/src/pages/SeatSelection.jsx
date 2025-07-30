import React, { useState } from 'react';
import wheel from '../Assets/wheel.jpg';
import seat from '../Assets/seat.png';
import '../css/Seat.css';
import { useSelector, useDispatch } from 'react-redux';
import BDpoint from './BDpoint.json';
import Header from './Homenavbar'
import { addSeat } from '../features/BookingSlice';
import { useNavigate } from 'react-router-dom';

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const selectedBus = useSelector((state) => state.bus.selectedBus);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const[showModel, setShowModel] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [boardingCity] = useState(selectedBus?.from);
  const [droppingCity] = useState(selectedBus?.to);
  const boardingData = BDpoint.find((point) => point.city === boardingCity);
  const droppingData = BDpoint.find((point) => point.city === droppingCity);
  const filteredBoardingPoints = boardingData ? boardingData.boardingPoints : [];
  const filteredDroppingPoints = droppingData ? droppingData.droppingPoints : [];
  const totalRows = 10;
 const totalFair = selectedBus.fare * selectedSeats.length;
 const toggleSeat = (seatNumber) => {
  let updatedSeats;
  if (selectedSeats.includes(seatNumber)) {
    // Seat already selected → remove it
    updatedSeats = selectedSeats.filter((s) => s !== seatNumber);
  } else {
    // Seat not selected → add it
    updatedSeats = [...selectedSeats, seatNumber];
  }

  setSelectedSeats(updatedSeats);

  // Update in Redux store
  dispatch(addSeat({
    busId: selectedBus.id,
    seats: updatedSeats
  })
);
};

  
/** seat selected option color changing  */
const bookings = useSelector((state) => state.book.bookings || []);
// console.log("All bookings:", bookings);

// ✅ Filter bookings for the selected busId
const currentBusBookings = bookings.filter((booking) => {
  const match = Number(booking.busId) === Number(selectedBus?.id);
  const hasSeats = Array.isArray(booking.seat);
  const hasPassengers = Array.isArray(booking.passengerDetails);
  return match && hasSeats && hasPassengers;
});

// console.log("Filtered bookings for selected bus:", currentBusBookings);

const bookedSeats = new Set();
const femaleBookedSeats = new Set();
// ✅ Fill booked and female seats
currentBusBookings.forEach((booking, i) => {
  booking.seat?.forEach((seatNum, idx) => {
    bookedSeats.add(seatNum);

    const passenger = booking.passengerDetails?.[idx];
    if (passenger?.gender?.toLowerCase() === "female") {
      femaleBookedSeats.add(seatNum);
    }
  });
});

// console.log("bookedSeats:", Array.from(bookedSeats));
// console.log("femaleBookedSeats:", Array.from(femaleBookedSeats));

// ✅ Identify adjacent-to-female seats (not booked)
const adjacentToFemale = new Set();

// femaleBookedSeats.forEach((seat) => {
//   const row = Math.floor((seat - 1) / 4);
//   const left = seat - 1;
//   const right = seat + 1;

//   if (Math.floor((left - 1) / 4) === row && !bookedSeats.has(left)) {
//     adjacentToFemale.add(left);
//   }
//   if (Math.floor((right - 1) / 4) === row && !bookedSeats.has(right)) {
//     adjacentToFemale.add(right);
//   }
// });


// const adjacentToFemale = new Set();

femaleBookedSeats.forEach((seat) => {
  const rowStart = Math.floor((seat - 1) / 4) * 4 + 1;

  const seat1 = rowStart;     // Left side
  const seat2 = rowStart + 1;
  const seat3 = rowStart + 2; // Right side
  const seat4 = rowStart + 3;

  // Left pair: 1 and 2
  if (seat === seat1 && !bookedSeats.has(seat2)) {
    adjacentToFemale.add(seat2);
  }
  if (seat === seat2 && !bookedSeats.has(seat1)) {
    adjacentToFemale.add(seat1);
  }

  // Right pair: 3 and 4
  if (seat === seat3 && !bookedSeats.has(seat4)) {
    adjacentToFemale.add(seat4);
  }
  if (seat === seat4 && !bookedSeats.has(seat3)) {
    adjacentToFemale.add(seat3);
  }
});  

// console.log("adjacentToFemale:", Array.from(adjacentToFemale));

// ✅ Get color logic
// const getSeatColor = (seatNum) => {
//   if (bookedSeats.has(seatNum)) {
//     return 'gray'; // Booked
//   } else if (adjacentToFemale.has(seatNum)) {
//     return 'pink'; // Next to a female
//   } else if (selectedSeats.includes(seatNum)) {
//     return 'green'; // Selected
//   } else {
//     return 'black'; // Available
//   }
// };



  return (
    <div>
    <Header/>
   <div className="buspg-seat-container">
  <div className="buspg-travel-info">
    Your travelling details: <strong>{selectedBus?.from}</strong> → <strong>{selectedBus?.to}</strong> on <strong>{selectedBus?.journeyDate}</strong>
  </div>

  {/* Bus Container */}
  <div className="buspg-bus-container">
    <div className="buspg-steering">
      <img src={wheel} alt="Driver" className="buspg-driver-img" />
    </div>

    {/* Seats */}
    <div className="buspg-seating">
      {[...Array(totalRows)].map((_, rowIndex) => {
        const baseSeat = rowIndex * 4;

        return (
          <div className="buspg-row" key={rowIndex}>
            {/* Left 2 seats */}
            {[0, 1].map((offset) => {
              const seatNum = baseSeat + offset + 1;
              const isBooked = bookedSeats.has(seatNum);
              const isFemaleAdjacent = adjacentToFemale.has(seatNum);
              const isSelected = selectedSeats.includes(seatNum);

              return (
                <div className="buspg-seat-wrapper" key={seatNum}>
                  <img
                    src={seat}
                    alt={`Seat ${seatNum}`}
                    className={`buspg-seat 
                      ${isBooked ? "booked" : ""}
                      ${isFemaleAdjacent ? "female-adjacent" : ""}
                      ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      if (!isBooked) toggleSeat(seatNum);
                    }}
                  />
                  <span className="buspg-fare">{selectedBus.fare}</span>
                </div>
              );
            })}

            {/* Aisle */}
            <div className="buspg-gap"></div>

            {/* Right 2 seats */}
            {[2, 3].map((offset) => {
              const seatNum = baseSeat + offset + 1;
              const isBooked = bookedSeats.has(seatNum);
              const isFemaleAdjacent = adjacentToFemale.has(seatNum);
              const isSelected = selectedSeats.includes(seatNum);

              return (
                <div className="buspg-seat-wrapper" key={seatNum}>
                  <img
                    src={seat}
                    alt={`Seat ${seatNum}`}
                    className={`buspg-seat 
                      ${isBooked ? "booked" : ""}
                      ${isFemaleAdjacent ? "female-adjacent" : ""}
                      ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      if (!isBooked) toggleSeat(seatNum);
                    }}
                  />
                  <span className="buspg-fare">{selectedBus.fare}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  </div>



      {/*summary */}
      <div className='summary-contianer'>
      <div className="summary">
        <p>{selectedSeats.length} seat  {totalFair} </p>
        <button onClick={()=> setShowModel(true)}>Select Boarding & Dropping Points</button>
      </div>
      </div>

      {/* refence buses seat */}
         <div className="bus-legend-container">
        <h3 className="legend-title">Seat Status</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <img src={seat} alt="Available" className="seat-img1" />
            <span>Available</span>
          </div>
          <div className="legend-item">
            <img src={seat} alt="Booked" className="seat-img2" />
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <img src={seat} alt="Ladies Seat" className="seat-img3" />
            <span>Ladies</span>
          </div>
          <div className="legend-item">
            <img src={seat} alt="Selected" className="seat-img4" />
            <span>Selected</span>
          </div>
        </div>
      </div>

        {/* Boarding Points */}
    {showModel && (
  <div className="selection-modal">
    <div className="selection-content">
    
      <div className="points-section">
        <h3>Boarding Points</h3>
        <form>
          {filteredBoardingPoints.map((point, index) => (
            <div className="radio-option" key={index}>
              <label>
                <input
                  type="radio"
                  name="boardingPoint"
                  value={point}
                  checked={selectedPickup === point}
                  onChange={() => setSelectedPickup(point)}
                />
                {point}
              </label>
            </div>
          ))}
        </form>
      </div>

      {/* Dropping Points */}
      <div className="points-section">
        <h3>Dropping Points</h3>
        <form>
          {filteredDroppingPoints.map((point, index) => (
            <div className="radio-option" key={index}>
              <label>
                <input
                  type="radio"
                  name="droppingPoint"
                  value={point}
                  checked={selectedDrop === point}
                  onChange={() => setSelectedDrop(point)}
                />
                {point}
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>

    {/* Seat Selection Summary */}
    <div className="seat-summary">
      <p>
        <strong>{selectedSeats.length} seat(s)</strong> selected – ₹{totalFair}
      </p>
      <button className="fill-details-btn" onClick={() => navigate('/userDetails')}>Fill Passenger Details</button>
    </div>
  </div>
)}
    
     </div>
     
    </div>
  );
}

export default SeatSelection;
