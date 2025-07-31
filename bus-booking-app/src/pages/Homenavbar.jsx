import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, editUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faEdit,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import logo from "../Assets/logo.jpg";
import "../css/navBar.css";
import * as Yup from "yup";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logout successful");
  };

  const handleEditSubmit = (values) => {
    dispatch(editUser({ id: user.id, ...values }));
    toast.success("User updated successfully");
    setShowModal(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .required("Mobile is required"),
  });

  return (
    <header className="header">
      <div className="navbar">
        {/* Left Section */}
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logoq" />
          <span className="tagline">Your Journey, Our Priority</span>
        </div>

        {/* Center Title */}
        <div className="navbar-center">
          <h2 className="title-nav">Welcome to BusBuddy</h2>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* My Bookings - Only if Logged In */}
          {user && (
            <Link to="/mybookings" className="mybookings-link">
              My Bookings
            </Link>
          )}

          {/* Home Icon */}
          <FontAwesomeIcon
            icon={faHome}
            className="nav-icon"
            onClick={() => navigate("/")}
          />

          {/* User Logged In → Show User Icon, Else → Show Login | Signup */}
          {user ? (
            <FontAwesomeIcon
              icon={faUser}
              className="nav-icon"
              onClick={() => setShowPopup(!showPopup)}
            />
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <span className="auth-separator">/</span>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>
      </div>

      {showPopup && user && (
        <div className="userDetails-popup">
          {/* ✅ Centered Header with Edit Icon */}
          <div className="popup-header-center">
            <h4 className="popup-title">User Details</h4>
            <FontAwesomeIcon
              icon={faEdit}
              className="popup-icon edit-icon"
              title="Edit Profile"
              onClick={() => {
                setShowModal(true);
                setShowPopup(false);
              }}
            />
          </div>

          {/* ✅ User Info (Line by Line) */}
          <div className="user-info">
            <ul>
              <li>
                <span>{user.name}</span>
              </li>
              <li>
                <span>{user.email}</span>
              </li>
              <li>
                <span>{user.mobile}</span>
              </li>
            </ul>
          </div>

          {/* ✅ Logout */}
          <div className="logout-container" onClick={handleLogout}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="popup-icon logout-icon"
            />
            <span>Logout</span>
          </div>
        </div>
      )}

      {/* ✅ Edit User Modal */}
      {showModal && (
        <div className="editUser-modal">
          <div className="editUser-container">
            <h3 className="editUser">Edit User</h3>
            <Formik
              initialValues={{
                name: user.name,
                email: user.email,
                mobile: user.mobile,
              }}
              onSubmit={handleEditSubmit}
              validationSchema={validationSchema}
            >
              <Form>
                <div>
                  <Field name="name" placeholder="Name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                <div>
                  <Field name="email" placeholder="Email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>
                <div>
                  <Field name="mobile" placeholder="Mobile" />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="savebtn">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="cancelbtn"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
