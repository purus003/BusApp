import React from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/allbookings.css";

function Allbookings() {
  const allbookings = useSelector((state) => state.book?.bookings ?? []);
  const data = Array.isArray(allbookings) ? allbookings : [];

  return (
    <div className="container mt-4">
      <h2 className="text-light mb-3">All Buses Bookings</h2>
      <table className="table table-dark table-hover table-bordered text-center align-middle shadow-lg">
        <thead className="bg-secondary text-white">
          <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Bus ID</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Seats</th>
            <th>Passengers</th>
            <th>Total Fare</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center text-warning fw-bold">
                No bookings available
              </td>
            </tr>
          ) : (
            data.map((b, index) => (
              <tr key={b?.id ?? index}>
                <td>{b?.id}</td>
                <td>{b?.userId}</td>
                <td>{b?.busId}</td>
                <td>{b?.from}</td>
                <td>{b?.to}</td>
                <td>{b?.date}</td>
                <td>{Array.isArray(b?.seat) ? b.seat.join(", ") : "-"}</td>
                <td>
                  {Array.isArray(b?.passengerDetails) ? (
                    <ul className="list-unstyled mb-0">
                      {b.passengerDetails.map((p, i) => (
                        <li key={i}>
                          {p.name} | {p.age} | {p.gender}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
                <td>₹{b?.totalFare ?? 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Allbookings;
