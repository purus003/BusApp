import React from "react";
import { useSelector } from "react-redux";
import "../css/allbookings.css";

function Allbookings() {
  const allbookings = useSelector((state) => state.book?.bookings ?? []);
  const data = Array.isArray(allbookings) ? allbookings : [];
  console.log(typeof data);
  return (
    <div className="allbookings-container">
      <h2 className="allbookings-title">All Buses Bookings</h2>

      <table className="allbookings-table">
        <thead className="allbookings-header">
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
              <td colSpan="9" className="allbookings-empty">
                No bookings available
              </td>
            </tr>
          ) : (
            data.map((b, index) => (
              <tr className="allbookings-row" key={b?.id ?? index}>
                <td>{b?.id}</td>
                <td>{b?.userId}</td>
                <td>{b?.busId}</td>
                <td>{b?.from}</td>
                <td>{b?.to}</td>
                <td>{b?.date}</td>
                <td>{Array.isArray(b?.seat) ? b.seat.join(", ") : "-"}</td>
                <td>
                  {Array.isArray(b?.passengerDetails) ? (
                    <ul className="allbookings-passengers">
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
                <td className="allbookings-fare">₹{b?.totalFare ?? 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Allbookings;
