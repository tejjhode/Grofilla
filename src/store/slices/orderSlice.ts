import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Order } from '../../types';
import{fetchProductById} from './productSlice';

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


export const placeOrder = createAsyncThunk<Order[], void, { state: RootState; rejectValue: string }>(
  'orders/placeOrder',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get customer data from localStorage
      const customerData = localStorage.getItem("shopkeeper");
      if (!customerData) {
        return rejectWithValue("Customer data not found in localStorage. Please log in.");
      }

      const customer = JSON.parse(customerData);
      const customerId = customer?.id;
      if (!customerId) {
        return rejectWithValue("Customer ID not found. Please log in.");
      }

      // Get shopkeeperId from Redux store
      const shopkeeperId = getState().orders.shopkeeperId; // ✅ Correct way to access Redux state

      if (!shopkeeperId) {
        return rejectWithValue("Shopkeeper ID not found. Please select a product first.");
      }

      console.log("Customer ID:", customerId);
      console.log("Shopkeeper ID:", shopkeeperId);

      // Make API request to place order
      
console.log("Customer Data:", customerData);
      const response = await api.post(
        `/orders/place/${customerId}/${shopkeeperId}`,
        {}, 
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

// ✅ Fetch orders for a customer
export const fetchCustomerOrders = createAsyncThunk(
  'orders/fetchCustomerOrders',
  async (_, { rejectWithValue }) => {
    try {
       const customerData = localStorage.getItem("shopkeeper");
       if (!customerData) {
         return rejectWithValue("Customer data not found in localStorage. Please log in.");
       }
       const customer = JSON.parse(customerData);
       const customerId = customer?.id;
       console.log("Customer ID:", customerId);
      const response = await api.get(`/orders/customer/${customerId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch customer orders');
    }
  }
);

// ✅ Fetch orders for a shopkeeper
export const fetchShopkeeperOrders = createAsyncThunk<Order[], void, { state: RootState; rejectValue: string }>(
  'orders/fetchShopkeeperOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const shopkeeperId = getState().orders.shopkeeperId; // ✅ Correct way to access Redux state
      const response = await api.get(`/orders/shopkeeper/${shopkeeperId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch shopkeeper orders');
    }
  }
);

// ✅ Update order status
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

// ✅ Cancel an order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/cancel/${orderId}`);
      return orderId; // Return orderId so we can remove it from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Fetch Customer Orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.shopkeeperId = action.payload.shopkeeperId; // Store shopkeeperId
      })
      // ✅ Fetch Shopkeeper Orders
      .addCase(fetchShopkeeperOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;