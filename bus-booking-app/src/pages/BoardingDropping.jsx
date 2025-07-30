import React, { useState } from "react";
import { useSelector } from "react-redux";
import BDpoint from "./BDpoint.json";
import "../css/BordingDropping.css";
import { toast } from "react-toastify";

function BoardingDropping({ next, back, setBoardingPoint, setDroppingPoint }) {
  const selectedBus = useSelector((state) => state.bus.selectedBus);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);

  const boardingCity = selectedBus?.from || "";
  const droppingCity = selectedBus?.to || "";

  const boardingData = BDpoint.find(
    (point) => point.city.toLowerCase() === boardingCity.toLowerCase()
  );
  const droppingData = BDpoint.find(
    (point) => point.city.toLowerCase() === droppingCity.toLowerCase()
  );

  const filteredBoardingPoints = boardingData?.boardingPoints || [];
  const filteredDroppingPoints = droppingData?.droppingPoints || [];

  const handleNext = () => {
    if (!pickup || !drop) {
      toast.warning("Please select both Boarding and Dropping points!");
      return;
    }
    setBoardingPoint(pickup);
    setDroppingPoint(drop);
    next();
  };

  return (
    <div className="bd-wrapper">
      <div className="bd-container">
        <h3 className="bd-header">Select Boarding & Dropping Points</h3>

        <div className="bd-row">
          <div className="bd-column">
            <h4>Boarding Points</h4>
            <ul>
              {filteredBoardingPoints.map((point, i) => (
                <li
                  key={i}
                  className={`bd-point-item ${
                    pickup === point ? "selected" : ""
                  }`}
                  onClick={() => setPickup(point)}
                >
                  <div className="bd-info">
                    <div className="bd-title">{point}</div>
                    {pickup === point && (
                      <span className="bd-selected">
                        Your selected Boarding Point
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    className="bd-radio"
                    checked={pickup === point}
                    onChange={() => setPickup(point)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Dropping Points */}
          <div className="bd-column">
            <h4>Dropping Points</h4>
            <ul>
              {filteredDroppingPoints.map((point, i) => (
                <li
                  key={i}
                  className={`bd-point-item ${
                    drop === point ? "selected" : ""
                  }`}
                  onClick={() => setDrop(point)}
                >
                  <div className="bd-info">
                    <div className="bd-title">{point}</div>
                    {drop === point && (
                      <span className="bd-selected">
                        Your selected Dropping Point
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    className="bd-radio"
                    checked={drop === point}
                    onChange={() => setDrop(point)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ✅ Navigation Buttons */}
        <div className="bd-actions">
          <button className="bd-back" onClick={back}>
            ⬅ Back
          </button>
          <button
            className="bd-next"
            onClick={handleNext}
            disabled={!pickup || !drop}
          >
            Fill Passenger Details ➡
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardingDropping;
