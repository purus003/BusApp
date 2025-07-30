import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Buspage from "../pages/busespage";
import SeatSelection from "../pages/SeatSelection";
import UserDetails from "../pages/userdetails";
import Mybookings from "../pages/Mybookings";
import Allbookings from "../pages/Allbookings";
import BookingFlow from "../pages/BookingFlow";
import SeatSelections from "../pages/SeatSelections";
import PassengerInfo from "../pages/PassengerInfo";
import BoardingDropping from "../pages/BoardingDropping";
import ConfirmBooking from "../pages/confrimBooking";
import PaymentPage from "../pages/Payment";

function Routing() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logut" element={<Logout />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/buses" element={<Buspage />} />
          <Route path="/seat" element={<SeatSelection />} />
          <Route path="/bookingFlow" element={<BookingFlow />} />
          <Route path="/select-seats" element={<SeatSelections />} />
          <Route path="/boarding-points" element={<BoardingDropping />} />
          <Route path="/passenger-info" element={<PassengerInfo />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/mybookings" element={<Mybookings />} />
          <Route path="/allBookings" element={<Allbookings />} />
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Routing;
