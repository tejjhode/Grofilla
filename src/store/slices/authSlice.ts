import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Define User Type
interface User {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "SHOPKEEPER";
  address?: string;
  phoneNumber?: string;
  shopAddress?: string;
  shopName?: string;
}

// Define Auth State
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Load User from Local Storage
const storedUser = localStorage.getItem("user");
const user: User | null = storedUser ? JSON.parse(storedUser) : null;

// Initial State
const initialState: AuthState = {
  user,
  loading: false,
  error: null,
};

// ✅ Login Thunk
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password, role }: { email: string; password: string; role: "CUSTOMER" | "SHOPKEEPER" },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = role === "SHOPKEEPER" ? "/api/shopkeepers/login" : "/api/customers/login";
      const response = await api.post(endpoint, { email, password });

      if (!response.data || !response.data.id) {
        throw new Error("Invalid login response");
      }

      // ✅ Store user data
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// ✅ Register Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { 
      name: string; 
      email: string; 
      password: string; 
      role: "CUSTOMER" | "SHOPKEEPER"; 
      address?: string;
      phoneNumber?: string;
      shopAddress?: string;
      shopName?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = userData.role === "SHOPKEEPER" ? "/api/shopkeepers/register" : "/api/customers/register";
      const response = await api.post(endpoint, userData);

      if (!response.data || !response.data.id) {
        throw new Error("Invalid registration response");
      }

      // ✅ Store user data
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;