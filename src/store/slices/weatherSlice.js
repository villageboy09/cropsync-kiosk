import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Fetch weather data for farmer's location
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (farmerId, { rejectWithValue }) => {
    try {
      // Get farmer's location
      const { data: farmer, error: farmerError } = await supabase
        .from('farmers')
        .select('village, district, state')
        .eq('id', farmerId)
        .single();

      if (farmerError) throw farmerError;

      // Fetch weather data from weather table (if exists)
      const { data: weather, error: weatherError } = await supabase
        .from('weather')
        .select('*')
        .eq('district', farmer.district)
        .order('date', { ascending: false })
        .limit(7);

      if (weatherError && weatherError.code !== 'PGRST116') {
        // PGRST116 is "table not found" error
        throw weatherError;
      }

      return {
        location: {
          village: farmer.village,
          district: farmer.district,
          state: farmer.state,
        },
        forecast: weather || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    location: null,
    current: null,
    forecast: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setMockWeatherData: (state) => {
      // Mock data for demonstration when API is not available
      state.current = {
        temp: 28,
        condition: 'Partly Cloudy',
        condition_te: 'పాక్షికంగా మేఘావృతం',
        humidity: 65,
        wind_speed: 12,
        rainfall: 0,
      };
      state.forecast = [
        { date: new Date().toISOString(), temp_max: 32, temp_min: 24, condition: 'Sunny', condition_te: 'ఎండగా', rainfall_chance: 10 },
        { date: new Date(Date.now() + 86400000).toISOString(), temp_max: 31, temp_min: 23, condition: 'Partly Cloudy', condition_te: 'పాక్షికంగా మేఘావృతం', rainfall_chance: 20 },
        { date: new Date(Date.now() + 172800000).toISOString(), temp_max: 29, temp_min: 22, condition: 'Cloudy', condition_te: 'మేఘావృతం', rainfall_chance: 40 },
        { date: new Date(Date.now() + 259200000).toISOString(), temp_max: 27, temp_min: 21, condition: 'Rainy', condition_te: 'వర్షం', rainfall_chance: 80 },
        { date: new Date(Date.now() + 345600000).toISOString(), temp_max: 28, temp_min: 22, condition: 'Rainy', condition_te: 'వర్షం', rainfall_chance: 70 },
        { date: new Date(Date.now() + 432000000).toISOString(), temp_max: 30, temp_min: 23, condition: 'Partly Cloudy', condition_te: 'పాక్షికంగా మేఘావృతం', rainfall_chance: 30 },
        { date: new Date(Date.now() + 518400000).toISOString(), temp_max: 31, temp_min: 24, condition: 'Sunny', condition_te: 'ఎండగా', rainfall_chance: 15 },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action.payload.location;
        
        if (action.payload.forecast.length > 0) {
          state.current = action.payload.forecast[0];
          state.forecast = action.payload.forecast;
        } else {
          // Use mock data if no weather data available
          state.current = {
            temp: 28,
            condition: 'Partly Cloudy',
            condition_te: 'పాక్షికంగా మేఘావృతం',
            humidity: 65,
            wind_speed: 12,
            rainfall: 0,
          };
          state.forecast = [
            { date: new Date().toISOString(), temp_max: 32, temp_min: 24, condition: 'Sunny', condition_te: 'ఎండగా', rainfall_chance: 10 },
            { date: new Date(Date.now() + 86400000).toISOString(), temp_max: 31, temp_min: 23, condition: 'Partly Cloudy', condition_te: 'పాక్షికంగా మేఘావృతం', rainfall_chance: 20 },
            { date: new Date(Date.now() + 172800000).toISOString(), temp_max: 29, temp_min: 22, condition: 'Cloudy', condition_te: 'మేఘావృతం', rainfall_chance: 40 },
            { date: new Date(Date.now() + 259200000).toISOString(), temp_max: 27, temp_min: 21, condition: 'Rainy', condition_te: 'వర్షం', rainfall_chance: 80 },
            { date: new Date(Date.now() + 345600000).toISOString(), temp_max: 28, temp_min: 22, condition: 'Rainy', condition_te: 'వర్షం', rainfall_chance: 70 },
            { date: new Date(Date.now() + 432000000).toISOString(), temp_max: 30, temp_min: 23, condition: 'Partly Cloudy', condition_te: 'పాక్షికంగా మేఘావృతం', rainfall_chance: 30 },
            { date: new Date(Date.now() + 518400000).toISOString(), temp_max: 31, temp_min: 24, condition: 'Sunny', condition_te: 'ఎండగా', rainfall_chance: 15 },
          ];
        }
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setMockWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;
