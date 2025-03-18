import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";
import cartSync from "../cart/cartSync";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginError {
  message: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  emailPhoneNumberString: string;
  password: string;
}

// Add these utility functions at the top of the file
const getStoredToken = () => {
  const token = localStorage.getItem('auth_token');
  console.log('🔐 Getting stored token:', token ? 'Token exists' : 'No token found');
  return token;
};

const setStoredToken = (token: string | null) => {
  console.log('🔐 Setting token:', token ? 'New token being stored' : 'Clearing token');
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

const validateToken = (token: string | null): boolean => {
  if (!token) {
    console.log('🔐 Token validation failed: No token provided');
    return false;
  }
  try {
    // Add basic JWT validation if needed
    const parts = token.split('.');
    const isValid = parts.length === 3;
    console.log('🔐 Token validation:', isValid ? 'Valid token structure' : 'Invalid token structure');
    return isValid;
  } catch {
    console.log('🔐 Token validation failed: Error parsing token');
    return false;
  }
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: LoginError }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login with:', credentials.emailPhoneNumberString);
      const response = await api.post<LoginResponse>('/auth/login', credentials);

      const { token, user } = response.data;
      console.log('✅ Login successful for user:', user.email);

      // Store token
      localStorage.setItem('auth_token', token);
      console.log('🔐 Token stored in localStorage');

      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed'
      });
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('auth_token');
      console.log('🔐 User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still remove token even if API call fails
      localStorage.removeItem('auth_token');
    }
  }
);

export const verifyIsLoggedIn = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔐 Verifying login status, token exists:', !!token);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get('/auth/verify');
      console.log('✅ User verification successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Verification failed:', error.response?.data?.message || error.message);
      localStorage.removeItem('auth_token');
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: LoginError }
>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting registration for:', credentials.email);
      const response = await api.post<LoginResponse>('/auth/register', credentials);

      const { token, user } = response.data;
      console.log('✅ Registration successful for user:', user.email);

      // Store token
      localStorage.setItem('auth_token', token);
      console.log('🔐 Token stored in localStorage');

      // Sync cart after successful registration if needed
      try {
        await cartSync.syncCartAfterLogin();
      } catch (error) {
        console.error("Failed to sync cart after registration:", error);
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      return rejectWithValue({
        message: error.response?.data?.message || 'Registration failed'
      });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    error: null,
    loading: false,
  } as AuthState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('auth_token');
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth_token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Verify
      .addCase(verifyIsLoggedIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyIsLoggedIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyIsLoggedIn.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth, updateToken } = authSlice.actions;

// Add selector for auth state
export const selectAuth = (state: { auth: AuthState }) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
  user: state.auth.user,
  loading: state.auth.loading
});

export default authSlice.reducer;
