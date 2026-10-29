import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/tickets');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tickets');
  }
});

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/tickets', ticketData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create ticket');
  }
});

export const updateTicket = createAsyncThunk('tickets/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/tickets/${id}`, updates);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update ticket');
  }
});

export const deleteTicket = createAsyncThunk('tickets/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tickets/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete ticket');
  }
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchTickets.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(fetchTickets.fulfilled, (state, action) => { state.isLoading = false; state.tickets = action.payload; });
    builder.addCase(fetchTickets.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Create
    builder.addCase(createTicket.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets.unshift(action.payload);
      state.successMessage = 'Ticket created successfully!';
    });
    builder.addCase(createTicket.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Update
    builder.addCase(updateTicket.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(updateTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.tickets.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.tickets[idx] = action.payload;
      state.successMessage = 'Ticket updated successfully!';
    });
    builder.addCase(updateTicket.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Delete
    builder.addCase(deleteTicket.pending, (state) => { state.isLoading = true; });
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      state.successMessage = 'Ticket deleted.';
    });
    builder.addCase(deleteTicket.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearMessages } = ticketSlice.actions;
export default ticketSlice.reducer;
