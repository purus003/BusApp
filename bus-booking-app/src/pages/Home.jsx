import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import { setFrom, setTo } from "../features/busSlice";
import citiesData from "./Cities.json";
import { fromAndTo } from "../features/adminSlice";
import Header from "./Homenavbar";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [filteredFromCities, setFilteredFromCities] = useState([]);
  const [filteredToCities, setFilteredToCities] = useState([]);

  const handleSearch = () => {
    if (!fromInput || !toInput || !dateInput) {
      toast.error("Please select all fields: From, To, and Date.");
      return;
    }
    if (fromInput === toInput) {
      toast.error("From and To cities cannot be the same.");
      return;
    }
    dispatch(fromAndTo({ from: fromInput, to: toInput, date: dateInput }));
    navigate("/buses");
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFromInput(value);
    const filteredCities = citiesData.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFromCities(filteredCities);
    dispatch(setFrom(value));
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setToInput(value);
    const filteredCities = citiesData.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredToCities(filteredCities);
    dispatch(setTo(value));
  };

  const handleSelectCity = (city, field) => {
    if (field === "from") {
      setFromInput(city);
      setFilteredFromCities([]);
      dispatch(setFrom(city));
    } else {
      setToInput(city);
      setFilteredToCities([]);
      dispatch(setTo(city));
    }
  };

  const handleTogglePlaces = () => {
    setFromInput(toInput);
    setToInput(fromInput);
    dispatch(setFrom(toInput));
    dispatch(setTo(fromInput));
  };

  return (
    <div className="main-wrapper">
      <Header />

      <div className="searchBar-wrapperContainer">
        <div className="searchBar-container">
          <div className="searchBar-wrapper">
            <input
              type="text"
              value={fromInput}
              onChange={handleFromChange}
              placeholder="From"
              className="searchBar-input"
              autoComplete="off"
            />
            {fromInput && filteredFromCities.length > 0 && (
              <div className="suggestions-container">
                {filteredFromCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCity(city, "from")}
                    className="suggestion-item"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="tglbtn"
            onClick={handleTogglePlaces}
            title="Swap From and To"
          >
            ↔️
          </button>

          <div className="searchBar-wrapper">
            <input
              type="text"
              value={toInput}
              onChange={handleToChange}
              placeholder="To"
              className="searchBar-input"
              autoComplete="off"
            />
            {toInput && filteredToCities.length > 0 && (
              <div className="suggestions-container">
                {filteredToCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCity(city, "to")}
                    className="suggestion-item"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="date"
            value={dateInput}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDateInput(e.target.value)}
            className="date-picker"
          />

          <button type="submit" className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About BusBuddy</h3>
            <p>
              BusBuddy is your trusted companion for booking affordable and
              reliable bus tickets across cities. We bring comfort, speed, and
              convenience to your journey.
            </p>
          </div>

          <div className="footer-section routes">
            <h3>Popular Routes</h3>
            <ul>
              <li>Vijayawada → Hyderabad</li>
              <li>Hyderabad → Bangalore</li>
              <li>Kurnool → Hyderabad</li>
              <li>Mysuru → Bangalore</li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>Email: support@busbuddy.com</p>
            <p>Phone: +91 7075873495</p>
            <p>Address: BusBuddy, Hyderabad, India</p>
          </div>

          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <FontAwesomeIcon
                icon={faFacebook}
                size="2x"
                className="social-icon"
              />
              <FontAwesomeIcon
                icon={faTwitter}
                size="2x"
                className="social-icon"
              />
              <FontAwesomeIcon
                icon={faInstagram}
                size="2x"
                className="social-icon"
              />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} BusBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
