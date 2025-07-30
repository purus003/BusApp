import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Homenavbar";
import "../css/userdetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Field, Formik, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { booking, removeSeat } from "../features/BookingSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PassengerInfo({ back }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const bus = useSelector((state) => state.bus.selectedBus);
  const seats = useSelector(
    (state) => state.book.selectedSeatsByBus[bus.id] || []
  );
  const totalFare = bus.fare * seats.length;

  const [passengers, setPassengers] = useState(
    Array.from({ length: seats.length }, () => ({
      name: "",
      age: "",
      gender: "",
    }))
  );

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
    navigate("/confirm-booking", {
      state: {
        passengers: values.passengers,
        bus,
        seats,
        totalFare,
      },
    });
  };

  return (
    <div className="user1">
      {/* ✅ User Details */}
      <div className="user1-details-container">
        <h2>Contact Details</h2>
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

      {/* ✅ Passenger Form */}
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
                  <br />
                  <span>Seat No: {seats[index]}</span>
                  <div className="name">
                    <Field
                      name={`passengers[${index}].name`}
                      placeholder="Name"
                    />
                    <div className="error-container">
                      <ErrorMessage
                        name={`passengers[${index}].name`}
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div className="name">
                    <Field
                      name={`passengers[${index}].age`}
                      type="text"
                      placeholder="Age"
                    />
                    <div className="error-container">
                      <ErrorMessage
                        name={`passengers[${index}].age`}
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div className="radio-group">
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
                    </div>
                    <div className="error-container">
                      <ErrorMessage
                        name={`passengers[${index}].gender`}
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="button-group">
                <button type="button" className="back-btn" onClick={back}>
                  Back
                </button>
                <button type="submit" className="proceed-btn">
                  Proceed Booking
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
export default PassengerInfo;
