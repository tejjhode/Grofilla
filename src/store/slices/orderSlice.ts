import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { Order } from "../../types";
import { fetchProductById } from "./productSlice";
import { RootState } from "../../store"; // Ensure RootState is imported

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

// ✅ Place Order (Fix: Handles correct API response)
export const placeOrder = createAsyncThunk<
  Order,
  void,
  { state: RootState; rejectValue: string }
>(
  "orders/placeOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const customerData = localStorage.getItem("user");
      if (!customerData) return rejectWithValue("Customer data not found. Please log in.");

      const customer = JSON.parse(customerData);
      const customerId = customer?.id;
      if (!customerId) return rejectWithValue("Customer ID not found. Please log in.");

      const shopkeeperId = getState().orders.shopkeeperId;
      if (!shopkeeperId) return rejectWithValue("Shopkeeper ID not found. Please select a product first.");

      const response = await api.post(`/orders/place/${customerId}/${shopkeeperId}`, {}, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      if (!response.data || !response.data.id) {
        return rejectWithValue("Invalid response from server.");
      }

      alert("Order placed successfully");
      console.log("Order ID:", response.data.id);

      return response.data; // ✅ Return the newly created order

    } catch (error: any) {
      console.error("Order Placement Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to place order.");
    }
  }
);

// ✅ Fetch Customer Orders
export const fetchCustomerOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchCustomerOrders", async (_, { rejectWithValue }) => {
  try {
    const customerData = localStorage.getItem("user");
    if (!customerData) return rejectWithValue("Customer data not found. Please log in.");

    const customer = JSON.parse(customerData);
    const customerId = customer?.id;
    const response = await api.get(`/orders/customer/${customerId}`);
  // console.log(response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch customer orders.");
  }
});

// ✅ Fetch Shopkeeper Orders
export const fetchShopkeeperOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState; rejectValue: string }
>("orders/fetchShopkeeperOrders", async (_, { getState, rejectWithValue }) => {
  try {
    const shopkeeperId = getState().orders.shopkeeperId;
    if (!shopkeeperId) return rejectWithValue("Shopkeeper ID is missing.");

    const response = await api.get(`/orders/shopkeeper/${shopkeeperId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch shopkeeper orders.");
  }
});

// ✅ Update Order Status (Fix: `status` converted to string correctly)
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: string },
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/update/${orderId}/${status}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update order status.");
    }
  }
);

// ✅ Cancel Order
export const cancelOrder = createAsyncThunk<
  number, // Returning the canceled order's ID
  number,
  { rejectValue: string }
>("orders/cancelOrder", async (orderId, { rejectWithValue }) => {
  try {
    await api.delete(`/orders/cancel/${orderId}`);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to cancel order.");
  }
});

// ✅ Order Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Place Order Cases
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload); // ✅ Fix: Push only the new order
      })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // 🔹 Fetch Customer Orders Cases
      .addCase(fetchCustomerOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchCustomerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // 🔹 Fetch Product by ID (to get Shopkeeper ID)
      .addCase(fetchProductById.fulfilled, (state, action) => { state.shopkeeperId = action.payload.shopkeeperId; })

      // 🔹 Fetch Shopkeeper Orders Cases
      .addCase(fetchShopkeeperOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // 🔹 Update Order Status Cases
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload; // ✅ Update the correct order
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // 🔹 Cancel Order Cases
      .addCase(cancelOrder.pending, (state) => { state.loading = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default orderSlice.reducer;