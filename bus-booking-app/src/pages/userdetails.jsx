import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Homenavbar";
import "../css/userdetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Field, Formik, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { addSeat, booking, removeSeat } from "../features/BookingSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const bus = useSelector((state) => state.bus.selectedBus);
  const selected = useSelector((state) => state.book.selectedSeatsByBus);
  const busId = bus.id;
  const from = bus.from;
  const to = bus.to;
  const seats = useSelector(
    (state) => state.book.selectedSeatsByBus[busId] || []
  );
  const length = seats.length;
  const userId = user.id;
  const totalFare = bus.fare * length;
  const [passengers, setPassengers] = useState(
    Array.from({ length }, () => ({
      name: "",
      age: "",
      gender: "",
    }))
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const schema = Yup.object().shape({
    passengers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        age: Yup.number()
          .typeError("Age must be a number")
          .required("Age is required"),
        gender: Yup.string().required("Gender is required"),
      })
    ),
  });

  const handleSubmit = (values) => {
    setPassengers(values.passengers);
    setShowConfirmation(true); // Show confirmation UI
  };

  const handleFinalConfirm = () => {
    dispatch(
      booking({
        busId,
        seat: seats,
        passengerDetails: passengers,
        from,
        to,
        userId,
        totalFare,
      })
    );
    dispatch(
      removeSeat({
        busId: busId,
        seat: [],
      })
    );

    toast.success("🎉 Booking Confirmed!", {
      position: "top-center",
      autoClose: 3000,
    });
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="user1">
        <div className="user1-details-container">
          <h2>Contact Details</h2>
          <p>Ticket details will be sent to</p>
          <div className="user1-info">
            <p>
              <strong>
                <FontAwesomeIcon icon={faUser} />
              </strong>{" "}
              {user.name}
            </p>
            <p>
              <strong>
                <FontAwesomeIcon icon={faEnvelope} />
              </strong>{" "}
              {user.email}
            </p>
            <p>
              <strong>
                <FontAwesomeIcon icon={faPhone} />
              </strong>{" "}
              {user.mobile}
            </p>
          </div>
        </div>

        <div className="passenger">
          <Formik
            initialValues={{ passengers }}
            validationSchema={schema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values }) => (
              <Form>
                <h1>Passenger Details</h1>
                {values.passengers.map((_, index) => (
                  <div key={index} className="passenger-form">
                    <FontAwesomeIcon icon={faUser} />{" "}
                    <strong>Passenger {index + 1}</strong>
                    <h4>Seat No: {seats[index]}</h4>
                    <div className="name">
                      <Field
                        name={`passengers[${index}].name`}
                        placeholder="Name"
                      />
                      <br />
                      <ErrorMessage
                        name={`passengers[${index}].name`}
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="name">
                      <Field
                        name={`passengers[${index}].age`}
                        type="text"
                        placeholder="Age"
                      />
                      <br />
                      <ErrorMessage
                        name={`passengers[${index}].age`}
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="radioButtons">
                      <label>
                        <Field
                          type="radio"
                          name={`passengers[${index}].gender`}
                          value="Male"
                        />{" "}
                        Male
                      </label>
                      <label>
                        <Field
                          type="radio"
                          name={`passengers[${index}].gender`}
                          value="Female"
                        />{" "}
                        Female
                      </label>
                      <br />
                      <ErrorMessage
                        name={`passengers[${index}].gender`}
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button type="submit">Proceed Booking</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {showConfirmation && (
        <div className="passenger-details-container">
          <h1>Please confirm your journey details</h1>
          <h3>{bus.journeyDate}</h3>
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <p>Selected Seat: {seats[index]}</p>
              <p>
                <strong>
                  {from} → {to}
                </strong>
              </p>
              <p>
                <strong>Passenger {index + 1}</strong>
              </p>
              <p>Name: {passenger.name}</p>
              <p>Age: {passenger.age}</p>
              <p>Gender: {passenger.gender}</p>
            </div>
          ))}
          <div className="totalfair">
            <strong>totalFare : {totalFare}</strong>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleFinalConfirm}> Confirm Booking</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserDetails;
