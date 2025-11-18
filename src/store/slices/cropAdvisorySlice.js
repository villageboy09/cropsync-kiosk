import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { differenceInDays } from 'date-fns';

// Fetch farmer's crops with all related data
export const fetchFarmerCrops = createAsyncThunk(
  'cropAdvisory/fetchFarmerCrops',
  async (farmerId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('farmer_crop_selections')
        .select(`
          *,
          crops (*),
          crop_varieties (*),
          sowing_dates (*)
        `)
        .eq('farmer_id', farmerId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch crop stages for a specific crop
export const fetchCropStages = createAsyncThunk(
  'cropAdvisory/fetchCropStages',
  async (cropId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crop_stages')
        .select('*')
        .eq('crop_id', cropId)
        .order('stage_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch problems for a specific stage
export const fetchStageProblems = createAsyncThunk(
  'cropAdvisory/fetchStageProblems',
  async ({ cropId, stageId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('crop_problems')
        .select(`
          *,
          crop_advisories (
            *,
            advisory_recommendations (*)
          )
        `)
        .eq('crop_id', cropId)
        .eq('stage_id', stageId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cropAdvisorySlice = createSlice({
  name: 'cropAdvisory',
  initialState: {
    farmerCrops: [],
    selectedCrop: null,
    cropStages: [],
    currentStage: null,
    stageProblems: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCrop: (state, action) => {
      state.selectedCrop = action.payload;
      
      // Calculate current stage based on sowing date
      if (action.payload?.sowing_dates?.sowing_date && state.cropStages.length > 0) {
        const sowingDate = new Date(action.payload.sowing_dates.sowing_date);
        const today = new Date();
        const daysElapsed = differenceInDays(today, sowingDate);
        
        // Find current stage based on days elapsed
        let cumulativeDays = 0;
        for (const stage of state.cropStages) {
          cumulativeDays += stage.duration_days || 0;
          if (daysElapsed < cumulativeDays) {
            state.currentStage = stage;
            break;
          }
        }
        
        // If past all stages, set to last stage
        if (!state.currentStage && state.cropStages.length > 0) {
          state.currentStage = state.cropStages[state.cropStages.length - 1];
        }
      }
    },
    clearSelectedCrop: (state) => {
      state.selectedCrop = null;
      state.cropStages = [];
      state.currentStage = null;
      state.stageProblems = [];
    },
    setCurrentStage: (state, action) => {
      state.currentStage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch farmer crops
      .addCase(fetchFarmerCrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerCrops.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerCrops = action.payload;
      })
      .addCase(fetchFarmerCrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch crop stages
      .addCase(fetchCropStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCropStages.fulfilled, (state, action) => {
        state.loading = false;
        state.cropStages = action.payload;
      })
      .addCase(fetchCropStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stage problems
      .addCase(fetchStageProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStageProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.stageProblems = action.payload;
      })
      .addCase(fetchStageProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCrop, clearSelectedCrop, setCurrentStage, clearError } = cropAdvisorySlice.actions;
export default cropAdvisorySlice.reducer;
