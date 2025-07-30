import React, { useState } from "react";
import "../css/bookingFlow.css";
import SeatSelections from "./SeatSelections";
import BoardingDropping from "./BoardingDropping";
import PassengerInfo from "./PassengerInfo";
import Header from "./Homenavbar";
import { toast } from "react-toastify";

function BookingFlow() {
  const [step, setStep] = useState(1);
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [droppingPoint, setDroppingPoint] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // ✅ handle seat selection coming from SeatSelections
  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  // ✅ Step navigation with validation
  const goToStep2 = () => {
    if (selectedSeats.length === 0) {
      toast.error(" Please select at least one seat before proceeding!");
      return;
    }
    setStep(2);
  };

  const goToStep3 = () => {
    if (!boardingPoint || !droppingPoint) {
      // toast.warning(" Please select both Boarding and Dropping points!");
      return;
    }
    setStep(3);
  };

  return (
    <>
      <Header />
      <div className="booking-container">
        {/* ✅ Stepper */}
        <div className="stepper">
          <div
            className={`step ${step === 1 ? "active" : ""}`}
            onClick={() => setStep(1)}
          >
            1. Select Seats
          </div>
          <div
            className={`step ${step === 2 ? "active" : ""}`}
            onClick={goToStep2}
          >
            2. Boarding / Drop Point
          </div>
          <div
            className={`step ${step === 3 ? "active" : ""}`}
            onClick={goToStep3}
          >
            3. Passenger Info
          </div>
        </div>

        {/* ✅ Step Content */}
        <div className="step-content">
          {step === 1 && (
            <SeatSelections
              next={goToStep2}
              onSeatChange={handleSeatSelection}
            />
          )}
          {step === 2 && (
            <BoardingDropping
              next={goToStep3}
              back={() => setStep(1)}
              setBoardingPoint={setBoardingPoint}
              setDroppingPoint={setDroppingPoint}
            />
          )}
          {step === 3 && <PassengerInfo back={() => setStep(2)} />}
        </div>
      </div>
    </>
  );
}

export default BookingFlow;
