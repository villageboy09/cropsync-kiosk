import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api';

const initialState = {
  user: authApi.getStoredUser(),
  session: null,
  loading: false,
  error: null,
  isAuthenticated: authApi.isAuthenticated(),
};

// Async thunks for authentication
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(userId);
      
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      
      // Store user in localStorage
      authApi.storeUser(response.user);
      
      return {
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signInByCard = createAsyncThunk(
  'auth/signInByCard',
  async ({ cardUid }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginByCard(cardUid);
      
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      
      // Store user in localStorage
      authApi.storeUser(response.user);
      
      return {
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Card login failed');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have a stored user and valid token
      const storedUser = authApi.getStoredUser();
      
      if (!storedUser) {
        return null;
      }
      
      // Verify token with backend
      const tokenResult = await authApi.verifyToken();
      
      if (tokenResult.valid) {
        return {
          user: storedUser,
          isValid: true,
        };
      } else {
        // Token invalid, clear storage
        authApi.logout();
        return null;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        authApi.storeUser(action.payload);
      }
    },
    setSession: (state, action) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
      authApi.logout();
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = { token: action.payload.token };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Sign In By Card
      .addCase(signInByCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInByCard.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = { token: action.payload.token };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInByCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, setSession, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
