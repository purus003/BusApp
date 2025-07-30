import React, { useState, useEffect } from "react";
import wheel from "../Assets/wheel.jpg";
import seat from "../Assets/seat.png";
import "../css/seatSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { addSeat } from "../features/BookingSlice";
import { toast } from "react-toastify";

function SeatSelections({ next, onSeatChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const selectedBus = useSelector((state) => state.bus.selectedBus) || {};
  const bookings = useSelector((state) => state.book.bookings) || [];
  const dispatch = useDispatch();

  const totalRows = 10;
  const fare = selectedBus?.fare || 0;
  const totalFair = fare * selectedSeats.length;

  // ✅ Booked seats logic
  const currentBusBookings = bookings.filter(
    (b) => Number(b.busId) === Number(selectedBus?.id)
  );
  const bookedSeats = new Set();
  const femaleBookedSeats = new Set();

  currentBusBookings.forEach((booking) => {
    booking?.seat?.forEach((s, i) => {
      bookedSeats.add(s);
      if (booking.passengerDetails?.[i]?.gender?.toLowerCase() === "female") {
        femaleBookedSeats.add(s);
      }
    });
  });

  // ✅ Adjacent seats for female
  const adjacentToFemale = new Set();
  femaleBookedSeats.forEach((seat) => {
    const rowStart = Math.floor((seat - 1) / 4) * 4 + 1;
    const [s1, s2, s3, s4] = [
      rowStart,
      rowStart + 1,
      rowStart + 2,
      rowStart + 3,
    ];
    if (seat === s1 && !bookedSeats.has(s2)) adjacentToFemale.add(s2);
    if (seat === s2 && !bookedSeats.has(s1)) adjacentToFemale.add(s1);
    if (seat === s3 && !bookedSeats.has(s4)) adjacentToFemale.add(s4);
    if (seat === s4 && !bookedSeats.has(s3)) adjacentToFemale.add(s3);
  });

  // ✅ Toggle seat selection
  const toggleSeat = (num) => {
    if (bookedSeats.has(num)) return;

    const updated = selectedSeats.includes(num)
      ? selectedSeats.filter((s) => s !== num)
      : [...selectedSeats, num];

    setSelectedSeats(updated);
    dispatch(addSeat({ busId: selectedBus?.id, seats: updated }));
  };

  // ✅ Send seat info to BookingFlow
  useEffect(() => {
    if (onSeatChange) onSeatChange(selectedSeats);
  }, [selectedSeats, onSeatChange]);

  return (
    <div className="buspg-seat-container">
      {/* <div className="buspg-travel-info">
        Your travelling details: <strong>{selectedBus?.from}</strong> →{" "}
        <strong>{selectedBus?.to}</strong> on{" "}
        <strong>{selectedBus?.journeyDate}</strong>
      </div> */}

      {/* ✅ Bus Layout */}
      <div className="buspg-bus-container">
        <div className="buspg-steering">
          <img src={wheel} alt="Driver" className="buspg-driver-img" />
        </div>

        <div className="buspg-seating">
          {[...Array(totalRows)].map((_, rowIndex) => {
            const base = rowIndex * 4;
            return (
              <div className="buspg-row" key={rowIndex}>
                {[0, 1].map((offset) => {
                  const num = base + offset + 1;
                  const isSelected = selectedSeats.includes(num);
                  return (
                    <div className="buspg-seat-wrapper" key={num}>
                      <img
                        src={seat}
                        alt={`Seat ${num}`}
                        className={`buspg-seat ${
                          bookedSeats.has(num) ? "booked" : ""
                        } ${
                          adjacentToFemale.has(num) ? "female-adjacent" : ""
                        } ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleSeat(num)}
                      />
                      <span className="buspg-fare">{fare}</span>
                    </div>
                  );
                })}
                <div className="buspg-gap"></div>
                {[2, 3].map((offset) => {
                  const num = base + offset + 1;
                  const isSelected = selectedSeats.includes(num);
                  return (
                    <div className="buspg-seat-wrapper" key={num}>
                      <img
                        src={seat}
                        alt={`Seat ${num}`}
                        className={`buspg-seat ${
                          bookedSeats.has(num) ? "booked" : ""
                        } ${
                          adjacentToFemale.has(num) ? "female-adjacent" : ""
                        } ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleSeat(num)}
                      />
                      <span className="buspg-fare">{fare}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Legend */}
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

      {/* ✅ Summary */}
      <div className="summary-contianer">
        <div className="summary">
          <p>
            {selectedSeats.length} seat(s) – ₹{totalFair}
          </p>
          <button
            onClick={() => {
              if (selectedSeats.length === 0) {
                toast.error("Please select at least one seat to continue!");
                return;
              }
              next();
            }}
          >
            Select Boarding & Dropping Points
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelections;
