import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Product } from '../../types';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/all');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// ✅ Fetch products by the logged-in shopkeeper
export const fetchShopkeeperProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchShopkeeperProducts',
  async (_, { rejectWithValue }) => {
    try {
      const shopkeeperData = localStorage.getItem("user");
      if (!shopkeeperData) {
        return rejectWithValue("Shopkeeper data not found in localStorage. Please log in.");
      }

      const shopkeeper = JSON.parse(shopkeeperData);
      const shopkeeperId = shopkeeper?.id;

      if (!shopkeeperId) {
        return rejectWithValue("Shopkeeper ID not found. Please log in.");
      }

      const response = await api.get(`/products/shopkeeper/${shopkeeperId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shopkeeper products');
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      return {
        ...product,
        shopkeeperId: product.shopkeeper.id, 
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const addProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  'products/addProduct',
  async (newProduct, { rejectWithValue }) => {
    try {
      const shopkeeperData = localStorage.getItem("shopkeeper");
      if (!shopkeeperData) {
        return rejectWithValue("Shopkeeper data not found in localStorage. Please log in.");
      }

      const shopkeeper = JSON.parse(shopkeeperData);
      const shopkeeperId = shopkeeper?.id;

      if (!shopkeeperId) {
        return rejectWithValue("Shopkeeper ID not found. Please log in.");
      }

      const response = await api.post(`/products/add/${shopkeeperId}`, newProduct);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

// ✅ Update an existing product (Shopkeeper)
export const updateProduct = createAsyncThunk<Product, { id: string; updatedData: Partial<Product> }, { rejectValue: string }>(
  'products/updateProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/update/${id}`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// ✅ Delete a product
export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/delete/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// ✅ Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      .addCase(fetchShopkeeperProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchShopkeeperProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch shopkeeper products';
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      })

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add product';
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload);
      });
  },
});

export const { resetSelectedProduct } = productSlice.actions;
export default productSlice.reducer;