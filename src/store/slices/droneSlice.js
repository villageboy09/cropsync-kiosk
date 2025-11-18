import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Fetch user's drone bookings
export const fetchUserBookings = createAsyncThunk(
  'drone/fetchUserBookings',
  async (farmerId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('drone_service_bookings')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new drone booking
export const createBooking = createAsyncThunk(
  'drone/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('drone_service_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const droneSlice = createSlice({
  name: 'drone',
  initialState: {
    bookings: [],
    currentBooking: {
      crop_type: '',
      acres: 1,
      service_date: '',
      rate_per_acre: 500, // Default rate
      total_cost: 500,
    },
    loading: false,
    error: null,
    bookingSuccess: false,
  },
  reducers: {
    updateBookingField: (state, action) => {
      const { field, value } = action.payload;
      state.currentBooking[field] = value;
      
      // Recalculate total cost when acres change
      if (field === 'acres') {
        state.currentBooking.total_cost = value * state.currentBooking.rate_per_acre;
      }
    },
    setRatePerAcre: (state, action) => {
      state.currentBooking.rate_per_acre = action.payload;
      state.currentBooking.total_cost = state.currentBooking.acres * action.payload;
    },
    resetCurrentBooking: (state) => {
      state.currentBooking = {
        crop_type: '',
        acres: 1,
        service_date: '',
        rate_per_acre: 500,
        total_cost: 500,
      };
      state.bookingSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.bookingSuccess = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      });
  },
});

export const {
  updateBookingField,
  setRatePerAcre,
  resetCurrentBooking,
  clearError,
  clearBookingSuccess,
} = droneSlice.actions;

export default droneSlice.reducer;
