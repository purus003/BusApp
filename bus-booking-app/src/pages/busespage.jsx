/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Homenavbar";
import { setSelectedBus } from "../features/adminSlice";
import "../css/buses.css";

function Buspage() {
  const [acChecked, setAcChecked] = useState(false);
  const [nonAcChecked, setNonAcChecked] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const allBuses = useSelector((state) => state.bus.fromAndTo);
  const now = new Date();

  const buses = allBuses.filter((bus) => {
    const departureDateTime = new Date(
      `${bus.journeyDate}T${bus.departureTime}`
    );
    return departureDateTime > now;
  });

  const filteredBuses = buses.filter((bus) => {
    if (acChecked && !nonAcChecked) return bus.type.toLowerCase() === "ac";
    if (!acChecked && nonAcChecked) return bus.type.toLowerCase() === "non-ac";
    if (acChecked && nonAcChecked)
      return ["ac", "non-ac"].includes(bus.type.toLowerCase());
    return true;
  });

  const navigate = useNavigate();

  const handlechange = (bus) => {
    if (!user) {
      navigate("/login", { state: { from: "/bookingFlow" } });
    } else {
      dispatch(setSelectedBus(bus));
      navigate("/bookingFlow");
    }
  };

  const getTotalJourneyTime = (arrivalTime, departureTime) => {
    const [depH, depM] = departureTime.split(":").map(Number);
    const [arrH, arrM] = arrivalTime.split(":").map(Number);
    const depDate = new Date(0, 0, 0, depH, depM);
    const arrDate = new Date(0, 0, 0, arrH, arrM);
    if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);
    const diffMs = arrDate - depDate;
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs / 60000) % 60);
    return `${hrs} hrs ${mins} mins`;
  };

  return (
    <div>
      <Header />

      <div className="buspgWrapper">
        {/* ✅ Sidebar Filter */}
        {buses.length > 0 && (
          <div className="buspg-filter">
            <h3 className="buspgH3">FILTERS</h3>
            <p className="buspgFilterTitle">AC TYPES</p>
            <div className="buspg-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={acChecked}
                  onChange={() => setAcChecked(!acChecked)}
                />{" "}
                AC
              </label>
            </div>
            <div className="buspg-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={nonAcChecked}
                  onChange={() => setNonAcChecked(!nonAcChecked)}
                />{" "}
                NON-AC
              </label>
            </div>
          </div>
        )}

        {/* ✅ Bus List */}
        <div className="buspgBusDetails">
          {filteredBuses.length === 0 ? (
            <div className="no-bus-container">
              <strong className="buspgNoBuses">
                No buses available for the selected route and date.
              </strong>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <div className="buspgCardNew" key={bus.id}>
                {/* ✅ LEFT: PRIMO + Bus Name + Number + Type + Amenities */}
                <div className="buspgLeft">
                  <span className="buspgPrimoBadge">PRIMO</span> ⭐
                  <h3 className="buspgBusTitle">
                    {bus.busName}{" "}
                    <span className="buspgBusNumber">({bus.busNumber})</span>
                  </h3>
                  <p className="buspgSubType">{bus.type} • Bharat Benz (2+2)</p>
                  {/* Amenities row */}
                  <div className="buspgAmenities">
                    {/* <span>🛏 Sleeper</span>
                    <span>❄️ AC</span> */}
                    <span>🔌 Charging</span>
                    <span>📶 Wifi</span>
                  </div>
                </div>

                {/* ✅ MIDDLE: Rating + Timings */}
                <div className="buspgMiddle">
                  {/* <span className="buspgRatingBadge">
                    ⭐ {bus.rating || "4.5"}
                  </span> */}
                  {/* <small className="buspgRatingText">Excellent</small> */}

                  <div className="buspgTimeRow">
                    <strong className="buspgTime">{bus.departureTime}</strong> →{" "}
                    <strong className="buspgTime">{bus.arrivalTime}</strong>
                  </div>
                  <p className="buspgDurationText">
                    {getTotalJourneyTime(bus.arrivalTime, bus.departureTime)}
                  </p>
                </div>

                {/* ✅ RIGHT: Discount + Fare + View Seats */}
                <div className="buspgRight">
                  <span className="buspgDiscount">🎉 Upto 10% Off</span>
                  <div className="buspgFare">₹{bus.fare}</div>
                  <small className="buspgOnwards">Onwards</small>
                  <button
                    className="buspgSelectSeats"
                    onClick={() => handlechange(bus)}
                  >
                    View Seats
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Buspage;
