import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import instructorReducer from "../features/instructors/instructorSlice"

export interface RootState {
  auth: ReturnType<typeof authReducer>
  instructors: ReturnType<typeof instructorReducer>
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorReducer,
  },
})

export type AppDispatch = typeof store.dispatch

