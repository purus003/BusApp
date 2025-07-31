import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import citiesData from "./Cities.json";
import {
  addbus,
  removeBus,
  editBus,
  filterBusesByNumber,
} from "../features/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPowerOff,
  faHouse,
  faBus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../Assets/logo.jpg";
import admin from "../css/admin.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

function Admin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(null);
  //  const busList = useSelector((state)=> state.bus.busList);

  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.auth.user);
  const { busList, filteredBuses } = useSelector((state) => state.bus);

  const busesToDisplay = searchTerm.trim() ? filteredBuses : busList;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(filterBusesByNumber(value));
  };

  const initialValues = {
    busName: "",
    busNumber: "",
    type: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    totalSeats: "",
    fare: "",
  };
  const [showModel, setShowModel] = useState(false);

  function handleOpen() {
    setShowModel(true);
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("logut successfully!");
  };

  const busSchema = Yup.object().shape({
    busName: Yup.string().required("Required"),
    busNumber: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    from: Yup.string().required("Required"),
    to: Yup.string().required("Required"),
    departureTime: Yup.string().required("Required"),
    arrivalTime: Yup.string().required("Required"),
    journeyDate: Yup.string().required("Required"),
    totalSeats: Yup.number().required("Required").positive(),
    fare: Yup.number().required("Required").positive(),
  });

  function goHome() {
    navigate("/");
  }

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addbus(values));
    resetForm();
    setShowModel(false);
  };

  function getTotalJourneyTime(arrivalTime, departureTime) {
    const [depHours, depMinutes] = departureTime.split(":").map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);
    const depDate = new Date(0, 0, 0, depHours, depMinutes);
    const arrDate = new Date(0, 0, 0, arrHours, arrMinutes);
    if (arrDate < depDate) {
      arrDate.setDate(arrDate.getDate() + 1);
    }
    const diffMs = arrDate - depDate;
    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMins = Math.floor((diffMs / 1000 / 60) % 60);

    return `${diffHrs} hrs ${diffMins} mins`;
  }

  function deleteBus(id) {
    dispatch(removeBus(id));
  }

  //** addinf jsx code filteitng cities */
  const [filteredFromCities, setFilteredFromCities] = useState(
    citiesData.map((c) => c.name)
  );
  const [filteredToCities, setFilteredToCities] = useState(
    citiesData.map((c) => c.name)
  );
  const [showDropdown, setShowDropdown] = useState({ from: false, to: false });
  const filterCities = (value) => {
    const allCities = citiesData; // already an array of strings
    if (!value) return allCities;
    return allCities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
  };

  return (
    <>
      {/* <div className="container">
        <div className="adnav">
          <img src={logo} alt="Logo not found" className="logo" />
          {/* <h1>Welcome to the Admin</h1> */}

      {/* <div className="nav-links">
            <button onClick={goHome}>
              <FontAwesomeIcon icon={faHouse} />
            </button>

            <div className="user-info">
              <FontAwesomeIcon icon={faUser} />
              <span className="username">{user.name}</span>
            </div>

            <Link to="/allbookings" className="nav-item">
              All Bookings
            </Link>

            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
        </div>
      </div> */}
      <AdminNavbar />

      <div className="bus-controls">
        <div className="left-column">
          {/* <FontAwesomeIcon icon={faBus} className="icon" /> */}
          <button className="addbus-btn" onClick={handleOpen}>
            Add Bus
          </button>
        </div>

        <div className="right-column">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search a bus"
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-input-btn"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      {showModel && (
        <div className="register-container">
          <Formik
            initialValues={initialValues}
            validationSchema={busSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="form">
                <h2 className="addbush2">Add New Bus</h2>

                {/* ✅ Bus Name & Number */}
                <div className="field-row">
                  <div className="field-col">
                    <label>Bus Name</label>
                    <Field
                      name="busName"
                      type="text"
                      placeholder="Enter bus name"
                    />
                    <ErrorMessage
                      name="busName"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-col">
                    <label>Bus Number</label>
                    <Field
                      name="busNumber"
                      type="text"
                      placeholder="Enter bus number"
                    />
                    <ErrorMessage
                      name="busNumber"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                {/* ✅ From & To with Autocomplete */}
                <div className="field-row">
                  {/* FROM */}
                  <div className="field-col" style={{ position: "relative" }}>
                    <label>From</label>
                    <input
                      type="text"
                      value={values.from}
                      placeholder="Enter city"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("from", val);
                        setFilteredFromCities(filterCities(val));
                        setShowDropdown((prev) => ({ ...prev, from: true }));
                      }}
                      onFocus={() =>
                        setShowDropdown((prev) => ({ ...prev, from: true }))
                      }
                      onBlur={() =>
                        setTimeout(
                          () =>
                            setShowDropdown((prev) => ({
                              ...prev,
                              from: false,
                            })),
                          200
                        )
                      }
                    />
                    {showDropdown.from && (
                      <ul className="dropdown">
                        {filteredFromCities.map((city, i) => (
                          <li
                            key={i}
                            onClick={() => {
                              setFieldValue("from", city);
                              setShowDropdown({ from: false, to: false });
                            }}
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                    <ErrorMessage
                      name="from"
                      component="div"
                      className="error"
                    />
                  </div>

                  {/* TO */}
                  <div className="field-col" style={{ position: "relative" }}>
                    <label>To</label>
                    <input
                      type="text"
                      value={values.to}
                      placeholder="Enter city"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("to", val);
                        setFilteredToCities(filterCities(val));
                        setShowDropdown((prev) => ({ ...prev, to: true }));
                      }}
                      onFocus={() =>
                        setShowDropdown((prev) => ({ ...prev, to: true }))
                      }
                      onBlur={() =>
                        setTimeout(
                          () =>
                            setShowDropdown((prev) => ({ ...prev, to: false })),
                          200
                        )
                      }
                    />
                    {showDropdown.to && (
                      <ul className="dropdown">
                        {filteredToCities.map((city, i) => (
                          <li
                            key={i}
                            onClick={() => {
                              setFieldValue("to", city);
                              setShowDropdown({ from: false, to: false });
                            }}
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                    <ErrorMessage name="to" component="div" className="error" />
                  </div>
                </div>

                {/* ✅ Departure & Arrival */}
                <div className="field-row">
                  <div className="field-col">
                    <label>Departure Time</label>
                    <Field
                      name="departureTime"
                      type="time"
                      className="time-input"
                    />
                    <ErrorMessage
                      name="departureTime"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-col">
                    <label>Arrival Time</label>
                    <Field
                      name="arrivalTime"
                      type="time"
                      className="time-input"
                    />
                    <ErrorMessage
                      name="arrivalTime"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                {/* ✅ Journey Date & Seats */}
                <div className="field-row">
                  <div className="field-col">
                    <label>Journey Date</label>
                    <Field name="journeyDate" type="date" />
                    <ErrorMessage
                      name="journeyDate"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-col">
                    <label>Total Seats</label>
                    <Field
                      name="totalSeats"
                      type="number"
                      placeholder="Total seats"
                    />
                    <ErrorMessage
                      name="totalSeats"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                {/* ✅ Bus Type & Fare */}
                <div className="field-row">
                  <div className="field-col">
                    <label>Bus Type</label>
                    <Field as="select" name="type" className="dropdown">
                      <option value="">Select Bus Type</option>
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      {/* <option value="Seater">Seater</option> */}
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-col">
                    <label>Fare</label>
                    <Field name="fare" type="number" placeholder="Enter fare" />
                    <ErrorMessage
                      name="fare"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                {/* ✅ Submit */}
                <div className="button-row">
                  <button type="submit">Register</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* <div className="displayBuses">
        {busesToDisplay.length === 0 ? (
          <p className="no-buses">No buses available.</p>
        ) : (
          <div className="busDetails">
            {busesToDisplay.map((bus) => (
              <div className="busContainer" key={bus.id}>
                <div className="busHeader">
                  <FontAwesomeIcon icon={faBus} className="busIcon" />
                  <h3>
                    {bus.busName} <span>({bus.busNumber})</span>
                  </h3>
                </div>

                <strong className="route">
                  {bus.from} <span className="arrow">➡️</span> {bus.to}
                </strong>
                <p className="timing">
                  <strong>{bus.arrivalTime}</strong> -{" "}
                  <strong>{bus.departureTime}</strong>
                  <br />
                  <strong>
                    {getTotalJourneyTime(bus.arrivalTime, bus.departureTime)}
                  </strong>
                  <br />
                  <small className="busType">{bus.type}</small>
                  <br />
                  <small className="fare">₹{bus.fare}</small>
                  <br />
                </p>

                <div className="actionButtons">
                  <button className="editBtn" onClick={() => setUpdate(bus)}>
                    Edit
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      deleteBus(bus.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div className="displayBuses">
        {busesToDisplay.length === 0 ? (
          <div className="frbus">
            <p className="no-buses">No buses available.</p>
          </div>
        ) : (
          <div className="busDetails">
            {busesToDisplay.map((bus) => (
              <div className="busContainer" key={bus.id}>
                <div className="busLeft">
                  <div className="busHeader">
                    <FontAwesomeIcon icon={faBus} className="busIcon" />
                    <h3>
                      {bus.busName} <span>({bus.busNumber})</span> &nbsp;{" "}
                      <small className="busType">{bus.type}</small>
                      {/* <div className="fare"> ⭐ </div> */}
                      {/**{bus.rating || "4.6"} */}
                    </h3>
                  </div>
                  <strong className="route">
                    {bus.from} <span className="arrow">➡️</span> {bus.to}
                  </strong>

                  <p className="timing">
                    <strong>{bus.arrivalTime}</strong> -{" "}
                    <strong>{bus.departureTime}</strong>
                    <br />
                    <strong>
                      {getTotalJourneyTime(bus.arrivalTime, bus.departureTime)}
                    </strong>
                  </p>

                  <div className="rating">₹{bus.fare}</div>

                  {/* <small className="busType">{bus.type}</small> */}
                </div>
                <div className="busRight">
                  <div className="fare"> ⭐ {bus.rating || "4.6"}</div>

                  <div className="actionButtons">
                    <button className="editBtn" onClick={() => setUpdate(bus)}>
                      Edit
                    </button>
                    <button
                      className="deleteBtn"
                      onClick={() => deleteBus(bus.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {update && (
        <div className="update-container">
          <Formik
            initialValues={{
              id: update.id,
              busName: update.busName || "",
              busNumber: update.busNumber || "",
              from: update.from || "",
              to: update.to || "",
              arrivalTime: update.arrivalTime || "",
              departureTime: update.departureTime || "",
              journeyDate: update.journeyDate || "",
              totalSeats: update.totalSeats || "",
              type: update.type || "",
              fare: update.fare || "",
            }}
            validationSchema={busSchema}
            enableReinitialize={true}
            onSubmit={(values) => {
              dispatch(editBus(values));
              setUpdate(null);
            }}
          >
            <Form className="form" key={update.id}>
              <h2> Make Changes to Bus Info {update.busName}</h2>

              <div className="field-row">
                <div className="field-col">
                  <label htmlFor="busName">Bus Name</label>
                  <Field
                    name="busName"
                    type="text"
                    placeholder="Enter bus name"
                  />
                  <ErrorMessage
                    name="busName"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="field-col">
                  <label htmlFor="busNumber">Bus Number</label>
                  <Field
                    name="busNumber"
                    type="text"
                    placeholder="Enter bus number"
                  />
                  <ErrorMessage
                    name="busNumber"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-col">
                  <label htmlFor="from">From</label>
                  <Field name="from" type="text" placeholder="From" />
                  <ErrorMessage name="from" component="div" className="error" />
                </div>
                <div className="field-col">
                  <label htmlFor="to">To</label>
                  <Field name="to" type="text" placeholder="To" />
                  <ErrorMessage name="to" component="div" className="error" />
                </div>
              </div>

              <div className="field-row">
                <div className="field-col">
                  <label htmlFor="departureTime">Select Departure Time</label>
                  <Field name="departureTime" type="time" />
                  <ErrorMessage
                    name="departureTime"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="field-col">
                  <label htmlFor="arrivalTime">Select Arrival Time</label>
                  <Field name="arrivalTime" type="time" />
                  <ErrorMessage
                    name="arrivalTime"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-col">
                  <label htmlFor="journeyDate">Journey Date</label>
                  <Field name="journeyDate" type="date" />
                  <ErrorMessage
                    name="journeyDate"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="field-col">
                  <label htmlFor="totalSeats">Total Seats</label>
                  <Field name="totalSeats" type="number" />
                  <ErrorMessage
                    name="totalSeats"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-col">
                  <label htmlFor="type">Bus Type</label>
                  <Field as="select" name="type" className="dropdown">
                    <option value="">Select Bus Type</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="error" />
                </div>

                <div className="field-col">
                  <label htmlFor="fare">Fare</label>
                  <Field name="fare" type="number" placeholder="Fare" />
                  <ErrorMessage name="fare" component="div" className="error" />
                </div>
              </div>

              <div className="button-row">
                <button type="submit">Update Bus</button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </>
  );
}

export default Admin;
