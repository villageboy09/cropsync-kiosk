import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Fetch all products with advertiser info
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          advertisers (
            advertiser_name,
            contact_number,
            email_address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          advertisers (
            advertiser_name,
            contact_number,
            email_address
          )
        `)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          advertisers (
            advertiser_name,
            contact_number,
            email_address
          )
        `)
        .or(`product_name_te.ilike.%${query}%,product_name_en.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    filteredProducts: [],
    categories: [],
    selectedProduct: null,
    selectedCategory: 'all',
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    extractCategories: (state) => {
      const uniqueCategories = [...new Set(state.products.map(p => p.category))];
      state.categories = uniqueCategories.filter(Boolean);
    },
    filterProducts: (state, action) => {
      const query = action.payload.toLowerCase();
      if (!query) {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          (product) =>
            product.product_name_te?.toLowerCase().includes(query) ||
            product.product_name_en?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query)
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        // Extract unique categories
        const uniqueCategories = [...new Set(action.payload.map(p => p.category))];
        state.categories = uniqueCategories.filter(Boolean);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedProduct,
  clearSelectedProduct,
  setSelectedCategory,
  setSearchQuery,
  extractCategories,
  filterProducts,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
