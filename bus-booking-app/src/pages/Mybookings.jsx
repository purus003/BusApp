import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "../css/booking.css";
import { removeBooking } from "../features/BookingSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Header from "./Homenavbar";

function Mybookings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const bookings = useSelector((state) => state.book.bookings);
  const buses = useSelector((state) => state.bus.busList || []);
  const userBookings = bookings
    .filter((b) => b.userId === userId)
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
    );

  const canCancelBooking = (journeyDate, departureTime) => {
    if (!journeyDate) return false;

    const safeDeparture = departureTime || "23:59";
    const busStartTime = new Date(`${journeyDate}T${safeDeparture}`);
    const currentTime = new Date();

    const diffMs = busStartTime.getTime() - currentTime.getTime();
    const fiveHoursMs = 5 * 60 * 60 * 1000;
    return diffMs > fiveHoursMs;
  };

  //  Cancel Booking Action
  const cancelBooking = (id) => {
    dispatch(removeBooking(id));
    toast.success(" Booking cancelled successfully!", {
      position: "top-center",
      autoClose: 3000,
      className: "bookingCancel-toast",
    });
  };

  return (
    <>
      <Header />
      <div className="mybooking_contiamer">
        {userBookings.length === 0 ? (
          <h3 className="no-bookings">❌ No bookings available</h3>
        ) : (
          userBookings.map((booking, index) => {
            const bus = buses.find((b) => b.id === booking.busId);
            if (!bus) return null;

            const allowCancel = canCancelBooking(
              bus.journeyDate,
              bus.departureTime
            );

            return (
              <div className="booking-contianer" key={index}>
                <div className="booking-card">
                  <h2 className="booking-title">
                    <FontAwesomeIcon icon={faBus} /> {bus.busName} ({bus.type})
                  </h2>

                  <p className="booking-info">
                    <span className="booking-label">From:</span> {booking.from}{" "}
                    ➡️
                    <span className="booking-label"> To:</span> {booking.to}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">Journey Date:</span>{" "}
                    {bus.journeyDate}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">Departure:</span>{" "}
                    {bus.departureTime}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">ArrivalTime:</span>{" "}
                    {bus.arrivalTime}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">BookedSeatsNumbers:</span>{" "}
                    {booking.seat.join(", ")}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">Total Fare:</span> ₹
                    {booking.totalFare}
                  </p>

                  <p className="booking-info">
                    <span className="booking-label">BookingDate:</span> &nbsp;
                    {`${booking.date} ${booking.time}`}
                  </p>

                  <h4 className="booking-subtitle">👥 Passenger Details:</h4>
                  <ul className="booking-passenger-list">
                    {booking.passengerDetails.map((p, i) => (
                      <li key={i} className="booking-passenger-item">
                        {p.name} | {p.age} yrs | {p.gender}
                      </li>
                    ))}
                  </ul>

                  {/* ✅ Cancel Button only if allowed */}
                  {allowCancel ? (
                    <button
                      className="cancelBooking"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <p className="cancel-disabled">
                      ⏳ Cancellation not allowed (Bus started or within 5
                      hours)
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Mybookings;
