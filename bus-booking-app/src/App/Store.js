import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import search from '../features/busSlice';
import city  from '../features/citySlice';
import buses from '../features/adminSlice'
import booking from '../features/BookingSlice'

export const Store = configureStore({
   reducer: {
    auth: authReducer,
    search:search,
    cities:city,
    bus:buses,
    book:booking,
  },
});
