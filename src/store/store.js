import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cropReducer from './slices/cropSlice';
import uiReducer from './slices/uiSlice';
import marketReducer from './slices/marketSlice';
import seedsReducer from './slices/seedsSlice';
import productsReducer from './slices/productsSlice';
import droneReducer from './slices/droneSlice';
import cropAdvisoryReducer from './slices/cropAdvisorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crop: cropReducer,
    ui: uiReducer,
    market: marketReducer,
    seeds: seedsReducer,
    products: productsReducer,
    drone: droneReducer,
    cropAdvisory: cropAdvisoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;
