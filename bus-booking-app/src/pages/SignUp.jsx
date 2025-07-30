import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../css/signup.module.css';
import Header from './Homenavbar';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ States for Show/Hide Passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must include at least one lowercase letter")
      .matches(/[A-Z]/, "Must include at least one uppercase letter")
      .matches(/[0-9]/, "Must include at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = (values) => {
    const { confirmPassword, ...userData } = values;
    dispatch(register(userData));
    navigate('/login');
    toast.success("User registered successfully");
  };

  return (
    <>
      <Header />
      <div className={styles.registerContainer}>
        <Formik
          initialValues={{ name: '', email: '', mobile: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <h2 className={styles.singupH2}>Register</h2>

            {/* ✅ Name & Email */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldCol}>
                <Field name="name" type="text" placeholder="Full Name" />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>
              <div className={styles.fieldCol}>
                <Field name="email" type="email" placeholder="Email" />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>
            </div>

            {/* ✅ Mobile & Password with Eye Icon */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldCol}>
                <Field name="mobile" type="text" placeholder="Mobile Number" />
                <ErrorMessage name="mobile" component="div" className={styles.error} />
              </div>

              <div className={styles.fieldCol}>
                <div className={styles.passwordWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={styles.passwordInput}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <ErrorMessage name="password" component="div" className={styles.error} />
              </div>
            </div>

            {/* ✅ Confirm Password with Eye Icon */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldCol}>
                <div className={styles.passwordWrapper}>
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={styles.passwordInput}
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
              </div>
              <div className={styles.fieldCol}></div>
            </div>

            {/* ✅ Submit Button */}
            <div className={styles.buttonRow}>
              <button type="submit">Register</button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default RegisterPage;
