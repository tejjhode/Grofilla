import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://tejas.yugal.tech/api/cart"; 

// Fetch Cart Items for a Specific User
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch cart items");
    }
  }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartId, quantity }: { cartId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${cartId}?quantity=${quantity}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update cart item");
    }
  }
);

// Remove Item from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${cartId}`);
      return cartId;
    } catch (error) {
      return rejectWithValue("Failed to remove item from cart");
    }
  }
);

// Clear User's Cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/user/${userId}/clear`);
      return userId;
    } catch (error) {
      return rejectWithValue("Failed to clear cart");
    }
  }
);

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove Item from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;