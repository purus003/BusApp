import React, { useState } from "react";
import logo from "../Assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, editUser } from "../features/authSlice";
import { toast } from "react-toastify";
import * as Yup from "yup";
import "../css/AdminNav.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPen, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <header className="admin-navbar">
      {/* Logo */}
      <div className="admin-navbar__logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Title */}
      {/* <h1 className="admin-navbar__title">Welcome to the Admin</h1> */}

      {/* Actions */}
      <div className="admin-navbar__actions">
        {/* ✅ Home Link instead of Icon */}
        <span className="admin-navbar__home-link" onClick={() => navigate("/")}>
          Home
        </span>

        {/* User Section */}
        <div className="admin-navbar__user">
          {/* <span className="admin-navbar__username">
            {user?.name || "Guest"}
          </span> */}
          <FontAwesomeIcon
            icon={faUser}
            className="admin-navbar__icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {/* <br /> */}
          {/* {user?.name || "Guest"} */}

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="admin-navbar__dropdown">
              <h4 className="admin-navbar__dropdown-title">
                User Details
                <FontAwesomeIcon
                  icon={faPen}
                  className="edit-icon"
                  title="Edit Profile"
                  onClick={() => {
                    setShowModal(true);
                    setDropdownOpen(false);
                  }}
                />
              </h4>
              <p>{user?.name}</p>
              <p>{user?.email}</p>
              <p>{user?.mobile}</p>
              <hr />
              {/* <button
                className="dropdown-item"
                onClick={() => navigate("/mybookings")}
              >
                My Bookings
              </button> */}
              <button
                className="dropdown-item"
                onClick={() => navigate("/allbookings")}
              >
                All Bookings
              </button>
              <hr />
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />{" "}
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
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
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error"
                    />
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
      </div>
    </header>
  );
}
