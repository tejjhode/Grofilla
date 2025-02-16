
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Define User Type
interface User {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "SHOPKEEPER";
}

// Define Auth State
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Load User from Local Storage
const storedUser = localStorage.getItem("shopkeeper");
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

      console.log("Full API Response:", response.data);

      if (!response.data || !response.data.id) {
        throw new Error("Invalid login response");
      }

      // ✅ Store the user object instead of token
      localStorage.setItem("shopkeeper", JSON.stringify(response.data));
      // localStorage.setItem("customer", JSON.stringify(response.data));

      console.log(localStorage);

      return response.data; // Return Shopkeeper or Customer data

    } catch (error: any) {
      console.error("Login API error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// ✅ Register Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string; role: "CUSTOMER" | "SHOPKEEPER" },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = userData.role === "SHOPKEEPER" ? "/api/shopkeepers/register" : "/api/customers/register";
      const response = await api.post(endpoint, userData);

      if (!response.data || !response.data.id) {
        throw new Error("Invalid registration response");
      }

      // ✅ Store the registered user
      localStorage.setItem("shopkeeper", JSON.stringify(response.data));

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
      localStorage.removeItem("shopkeeper");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store the user object
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store the registered user object
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;