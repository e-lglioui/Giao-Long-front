import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Role } from "./types/roles"

interface User {
  id: string
  username: string
  role: Role
  schoolIds?: string[]
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    updateRole: (state, action: PayloadAction<{ role: Role, schoolIds?: string[] }>) => {
      if (state.user) {
        state.user.role = action.payload.role
        state.user.schoolIds = action.payload.schoolIds
      }
    },
  },
})

export const { setUser, setLoading, setError, updateRole } = authSlice.actions
export default authSlice.reducer