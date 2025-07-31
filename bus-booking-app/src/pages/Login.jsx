import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../features/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../css/login.module.css";
import Header from "./Homenavbar";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const from =
    location.state?.from || (user?.role === "admin" ? "/admin" : "/");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const validateSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid Email Format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  return (
    <>
      <Header />
      <div className={styles.loginPage__container}>
        <div className={styles.loginPage__formBox}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validateSchema}
          >
            {() => (
              <Form>
                <h2 className={styles.loginPage__title}>Login</h2>

                {/* Email Input */}
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className={styles.loginPage__input}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={styles.loginPage__error}
                  />
                </div>

                {/* Password Input with Eye Icon */}
                <div className={styles.passwordWrapper}>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className={styles.loginPage__input}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className={styles.loginPage__error}
                  />
                </div>

                <center>
                  <button type="submit" className={styles.loginPage__lggbtn}>
                    Login
                  </button>
                </center>

                {/* Signup Redirect */}
                <p className={styles.loginPage__footerText}>
                  Don't have an account? &nbsp;
                  <Link to="/signup" className={styles.loginPage__link}>
                    Signup now
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Login;
