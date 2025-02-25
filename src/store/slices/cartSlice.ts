import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItem, Product } from '../../types';
import api from "../../services/api";


interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/cart/user/${userId}`);
      console.log(response.data);
      return response.data;  // Expecting cart items from backend
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ userId: string; product: Product; quantity: number }>) => {
      const { userId, product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          userId,
          productId: product.id,
          quantity,
          totalPrice: product.price * quantity,
          product,
        });
      }

      // Send API request to update backend
      axios.post(`/api/cart/${userId}/add`, { productId: product.id, quantity });
    },
    removeFromCart: (state, action: PayloadAction<{ userId: string; productId: string }>) => {
      state.items = state.items.filter(item => item.productId !== action.payload.productId);

      // Send API request to remove item from backend
      axios.delete(`/api/cart/${action.payload.userId}/remove/${action.payload.productId}`);
    },
    updateQuantity: (state, action: PayloadAction<{ userId: string; productId: string; quantity: number }>) => {
      const { userId, productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.product.price * quantity;
      }

      // Send API request to update backend
      axios.put(`/api/cart/${userId}/update`, { productId, quantity });
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
          const response = action.payload;
          state.items = Array.isArray(response) ? response : [response]; // Ensure it's an array
          state.loading = false;
        })
  
      // .addCase(fetchCart.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.items = action.payload;  // Update cart from backend
      // })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;