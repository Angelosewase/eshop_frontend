import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { default as Axios } from "../../app/axios";
import { toast } from "sonner";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { emailPhoneNumber: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Axios.post(
        "/auth/login",
        {
          emailPhoneNumberString: credentials.emailPhoneNumber,
          password: credentials.password,
        },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data) {
        toast.dismiss();
        toast.message("successfully logged in ");
      }
      return response.data.user;
    } catch (error) {
      return rejectWithValue((error as AxiosError)?.response?.data);
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError)?.response?.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    credentials: {
      emailPhoneNumberString: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { emailPhoneNumberString, ...rest } = credentials;
      const parsedCredentials: {
        email?: string;
        phoneNumber?: string;
        firstName: string;
        lastName: string;
      } = { ...rest };

      if (emailPhoneNumberString.includes("@")) {
        parsedCredentials.email = emailPhoneNumberString;
      } else {
        parsedCredentials.phoneNumber = emailPhoneNumberString;
      }

      const response = await Axios.post("/auth/register", parsedCredentials);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError)?.response?.data);
    }
  }
);

export const verifyIsLoggedIn = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get("/auth/verify");
      return response.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError)?.response?.data);
    }
  }
);

interface AuthState {
  user: null;
  error: unknown | null;
  loading: boolean;
}

export const authSlice = createSlice({
  name: "auth",
  reducers: {},
  initialState: { user: null, error: null, loading: false } as AuthState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyIsLoggedIn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(verifyIsLoggedIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyIsLoggedIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
