import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../css/payment.css";
import { toast } from "react-toastify";
import { booking  } from "../features/BookingSlice";
import { removeSeat } from "../features/BookingSlice";
import '../css/payment.css';

function PaymentPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state)=> state.auth.user);
  const { passengers, bus, seats, totalFare } = location.state || {};
  const [paymentMode, setPaymentMode] = useState("");
  const handlePayment = () => {
    if (!paymentMode) {
      alert("Please select a payment mode to proceed!");
      return;
    }
     dispatch(
        booking({
          busId: bus.id,
          seat: seats,
          passengerDetails: passengers,
          from: bus.from,
          to: bus.to,
          userId: user.id,
          totalFare,
          
        })
      );
      dispatch(removeSeat({ busId: bus.id, seat: [] }));
      toast.success("🎉 Booking Confirmed!", { position: "top-center", autoClose: 3000 });
      navigate("/");
  };

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>
      <div className="payment-form">
        <label>Select Mode of Payment:</label>
        <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
          <option value="">-- Select Payment Mode --</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
          <option value="Cash On Delivery">Cash On Delivery</option>
        </select>
        <button onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
}

export default PaymentPage;
