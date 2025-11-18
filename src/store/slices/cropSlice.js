import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

const initialState = {
  crops: [],
  selectedCrop: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    season: 'all',
  },
};

// Async thunks for crop operations
export const fetchCrops = createAsyncThunk(
  'crop/fetchCrops',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCropById = createAsyncThunk(
  'crop/fetchCropById',
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCrop = createAsyncThunk(
  'crop/addCrop',
  async (cropData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .insert([cropData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCrop = createAsyncThunk(
  'crop/updateCrop',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCrop = createAsyncThunk(
  'crop/deleteCrop',
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setSelectedCrop: (state, action) => {
      state.selectedCrop = action.payload;
    },
    clearSelectedCrop: (state) => {
      state.selectedCrop = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        season: 'all',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Crops
      .addCase(fetchCrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrops.fulfilled, (state, action) => {
        state.loading = false;
        state.crops = action.payload;
        state.error = null;
      })
      .addCase(fetchCrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Crop By ID
      .addCase(fetchCropById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCropById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrop = action.payload;
        state.error = null;
      })
      .addCase(fetchCropById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Crop
      .addCase(addCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.crops.unshift(action.payload);
        state.error = null;
      })
      .addCase(addCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Crop
      .addCase(updateCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCrop.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.crops.findIndex(crop => crop.id === action.payload.id);
        if (index !== -1) {
          state.crops[index] = action.payload;
        }
        if (state.selectedCrop?.id === action.payload.id) {
          state.selectedCrop = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Crop
      .addCase(deleteCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.crops = state.crops.filter(crop => crop.id !== action.payload);
        if (state.selectedCrop?.id === action.payload) {
          state.selectedCrop = null;
        }
        state.error = null;
      })
      .addCase(deleteCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setSelectedCrop, 
  clearSelectedCrop, 
  setFilters, 
  clearFilters, 
  clearError 
} = cropSlice.actions;

export default cropSlice.reducer;
