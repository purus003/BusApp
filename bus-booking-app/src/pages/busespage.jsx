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
  // const buses = useSelector((state) => state.bus.fromAndTo);
  const allBuses = useSelector((state) => state.bus.fromAndTo);
  const now = new Date();
  const buses = allBuses.filter((bus) => {
    const departureDateTime = new Date(
      `${bus.journeyDate}T${bus.departureTime}`
    );
    return departureDateTime > now;
  });
  console.log(allBuses);
  console.log(buses);

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
      navigate("/login", { state: { from: "/seat" } });
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

      {/* ✅ Wrapper after Navbar */}
      <div className="buspgWrapper">
        {/* ✅ Sidebar Filter */}
        {buses.length > 0 && (
          <div className="buspg-filter">
            <h3 className="buspgH3">FILTERS</h3>

            {/* <p className="buspgFilterTitle">BUS TYPES</p>
            <div className="buspg-checkbox">
              <label>
                <input type="checkbox" /> SEATER
              </label>
            </div> */}
            {/* <div className="buspg-checkbox">
              <label>
                <input type="checkbox" /> SLEEPER
              </label>
            </div> */}

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
                <div className="buspgHeaderRow">
                  <div>
                    <h3 className="buspgBusTitle">{bus.busName}</h3>
                    <p className="buspgSubType">
                      {bus.type} • Bharat Benz (2+2)
                    </p>
                  </div>
                  <span className="buspgFare">₹{bus.fare}</span>
                </div>

                <div className="buspgMeta">
                  <span className="buspgRatingBadge">
                    ⭐ {bus.rating || "3.9"}
                  </span>
                  <span className="buspgLiveTrack">📍 Live Tracking</span>
                </div>

                <div className="buspgTimeRow">
                  <strong className="buspgTime">{bus.departureTime}</strong> →{" "}
                  <strong className="buspgTime">{bus.arrivalTime}</strong>
                  <p className="buspgDurationText">
                    {getTotalJourneyTime(bus.arrivalTime, bus.departureTime)}
                  </p>
                </div>

                <div className="buspgActionRow">
                  <button
                    className="buspgSelectSeats"
                    onClick={() => handlechange(bus)}
                  >
                    SELECT SEATS
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
