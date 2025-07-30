import React from 'react'
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';


function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  useEffect (() =>{
    dispatch(logout());
    alert("logut succesful")
  },[dispatch, navigate]);
  return (
    <div>
    </div>
  )
}

export default Logout;
