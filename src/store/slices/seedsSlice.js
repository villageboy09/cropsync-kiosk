import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Fetch all seed varieties
export const fetchSeeds = createAsyncThunk(
  'seeds/fetchSeeds',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('seed_varieties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search seeds
export const searchSeeds = createAsyncThunk(
  'seeds/searchSeeds',
  async (query, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('seed_varieties')
        .select('*')
        .or(`variety_name_te.ilike.%${query}%,variety_name_en.ilike.%${query}%,crop_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const seedsSlice = createSlice({
  name: 'seeds',
  initialState: {
    seeds: [],
    filteredSeeds: [],
    selectedSeed: null,
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSelectedSeed: (state, action) => {
      state.selectedSeed = action.payload;
    },
    clearSelectedSeed: (state) => {
      state.selectedSeed = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    filterSeeds: (state, action) => {
      const query = action.payload.toLowerCase();
      if (!query) {
        state.filteredSeeds = state.seeds;
      } else {
        state.filteredSeeds = state.seeds.filter(
          (seed) =>
            seed.variety_name_te?.toLowerCase().includes(query) ||
            seed.variety_name_en?.toLowerCase().includes(query) ||
            seed.crop_name?.toLowerCase().includes(query)
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch seeds
      .addCase(fetchSeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.seeds = action.payload;
        state.filteredSeeds = action.payload;
      })
      .addCase(fetchSeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search seeds
      .addCase(searchSeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredSeeds = action.payload;
      })
      .addCase(searchSeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedSeed, clearSelectedSeed, setSearchQuery, filterSeeds, clearError } = seedsSlice.actions;
export default seedsSlice.reducer;
