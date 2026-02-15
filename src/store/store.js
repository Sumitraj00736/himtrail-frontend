import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from '../features/trips/tripsSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    auth: authReducer,
  },
});
