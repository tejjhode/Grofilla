import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Order } from '../../types';
import { fetchProductById } from './productSlice';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  shopkeeperId: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  shopkeeperId: null,
};

export const placeOrder = createAsyncThunk<
  Order, // ✅ Assuming API returns a single Order object
  void,
  { state: RootState; rejectValue: string }
>(
  "orders/placeOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      // 🔹 Retrieve customer data from localStorage
      const customerData = localStorage.getItem("user");
      if (!customerData) return rejectWithValue("Customer data not found. Please log in.");

      const customer = JSON.parse(customerData);
      const customerId = customer?.id;
      if (!customerId) return rejectWithValue("Customer ID not found. Please log in.");

      // 🔹 Retrieve shopkeeper ID from Redux state
      const shopkeeperId = getState().orders.shopkeeperId;
      if (!shopkeeperId) return rejectWithValue("Shopkeeper ID not found. Please select a product first.");

      // 🔹 Send API request to place order
      const response = await api.post(`/orders/place/${customerId}/${shopkeeperId}`, {}, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      // 🔹 Check if response is valid
      if (!response.data || !response.data.id) {
        return rejectWithValue("Invalid response from server.");
      }

      alert("Order placed successfully");
      console.log("Order ID:", response.data.id);

      return response.data; // ✅ Return the placed order

    } catch (error: any) {
      console.error("Order Placement Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to place order.");
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk('orders/fetchCustomerOrders', async (_, { rejectWithValue }) => {
  try {
    const customerData = localStorage.getItem('user');
    if (!customerData) return rejectWithValue('Customer data not found in localStorage. Please log in.');
    
    const customer = JSON.parse(customerData);
    const customerId = customer?.id;
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch customer orders');
  }
});

export const fetchShopkeeperOrders = createAsyncThunk<Order[], void, { state: RootState; rejectValue: string }>(
  'orders/fetchShopkeeperOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const shopkeeperId = getState().orders.shopkeeperId;
      const response = await api.get(`/orders/shopkeeper/${shopkeeperId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch shopkeeper orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/update/${orderId}/${status}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (orderId: number, { rejectWithValue }) => {
  try {
    await api.delete(`/orders/cancel/${orderId}`);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to cancel order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.orders.push(...action.payload); })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(fetchCustomerOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchCustomerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(fetchProductById.fulfilled, (state, action) => { state.shopkeeperId = action.payload.shopkeeperId; })
      
      .addCase(fetchShopkeeperOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(cancelOrder.pending, (state) => { state.loading = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default orderSlice.reducer;
