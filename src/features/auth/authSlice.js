import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const tokenKey = 'himtrail_token';

const saveToken = (token) => {
  if (token) localStorage.setItem(tokenKey, token);
};

const clearToken = () => localStorage.removeItem(tokenKey);

export const login = createAsyncThunk('auth/login', async (payload) => {
  const response = await api.post('/auth/login', payload);
  saveToken(response.data.data.token);
  return response.data.data;
});

export const register = createAsyncThunk('auth/register', async (payload) => {
  const response = await api.post('/auth/register', payload);
  saveToken(response.data.data.token);
  return response.data.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
