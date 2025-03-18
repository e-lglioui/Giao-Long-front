import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import instructorReducer from '../features/instructors/instructorSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
