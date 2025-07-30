import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/confrimBooking.css";

function ConfirmBooking() {
  const navigate = useNavigate();
  const location = useLocation();

  const { passengers, bus, seats, totalFare } = location.state || {};

  if (!bus || !passengers) {
    navigate("/");
    return null;
  }

  const handleProceedPayment = () => {
    navigate("/payment", { state: { passengers, bus, seats, totalFare } });
  };

  return (
    <div className="passenger-details-container">
      <h3>Please confirm your journey details</h3>
      <h3>{bus.journeyDate}</h3>

      {passengers.map((p, i) => (
        <div key={i} className="passenger-card">
          <span className="passen">
            <strong>Passgener {i + 1}</strong>
          </span>
          <br />
          <span className="passen">Selected Seat: {seats[i]}</span>
          <br />
          <span className="passen">
            {bus.from} → {bus.to}
          </span>
          <br />
          {/* <span className='passen'>Passenger {i + 1}</span>
          <br /> */}
          <span className="passen">Name: {p.name}</span>
          <br />
          <span className="passen">Age: {p.age}</span>
          <br />
          <span className="passen">Gender: {p.gender}</span>
        </div>
      ))}

      <div className="totalfair">
        <strong className="tfr">Total Fare: ₹{totalFare}</strong>
      </div>
      <span className="confirm-btn">
        <button onClick={handleProceedPayment}>Proceed to Payment</button>
      </span>
    </div>
  );
}

export default ConfirmBooking;
