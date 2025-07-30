import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { Store } from "./App/Store";
import Mybookings from "./pages/Mybookings";
import Routing from "./Routing/Routing";
import SeatSelection from "./pages/SeatSelection";
import Allbookings from "./pages/Allbookings";
import AdminNavbar from "./pages/AdminNavbar";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <Provider store={Store}>
    <Routing />
    <ToastContainer />
    {/* <AdminNavbar/> */}
    {/* <Allbookings/> */}
    {/* <Mybookings/> */}
    {/* <SeatSelection/> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
