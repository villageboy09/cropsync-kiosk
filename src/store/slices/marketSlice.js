import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Fetch market prices with filters
export const fetchMarketPrices = createAsyncThunk(
  'market/fetchPrices',
  async ({ commodity, district }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from('market_prices')
        .select('*')
        .order('arrival_date', { ascending: false });

      if (commodity && commodity !== 'all') {
        query = query.ilike('commodity', `%${commodity}%`);
      }

      if (district && district !== 'all') {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch unique districts
export const fetchDistricts = createAsyncThunk(
  'market/fetchDistricts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('district')
        .order('district');

      if (error) throw error;

      // Get unique districts
      const uniqueDistricts = [...new Set(data.map(item => item.district))];
      return uniqueDistricts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    prices: [],
    districts: [],
    selectedCommodity: 'rice',
    selectedDistrict: 'all',
    loading: false,
    error: null,
    stats: {
      totalMarkets: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
    },
  },
  reducers: {
    setSelectedCommodity: (state, action) => {
      state.selectedCommodity = action.payload;
    },
    setSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
    },
    calculateStats: (state) => {
      if (state.prices.length === 0) {
        state.stats = { totalMarkets: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
        return;
      }

      const prices = state.prices.map(p => p.modal_price);
      state.stats = {
        totalMarkets: state.prices.length,
        avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch market prices
      .addCase(fetchMarketPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
        // Calculate stats after fetching
        const prices = action.payload.map(p => p.modal_price);
        if (prices.length > 0) {
          state.stats = {
            totalMarkets: action.payload.length,
            avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
          };
        }
      })
      .addCase(fetchMarketPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCommodity, setSelectedDistrict, calculateStats, clearError } = marketSlice.actions;
export default marketSlice.reducer;
