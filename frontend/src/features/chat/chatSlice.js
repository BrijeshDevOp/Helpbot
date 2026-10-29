import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messages, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/ai/chat', { messages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reach AI service');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    messages: [],       // { role: 'user'|'assistant', content: string, type?: 'escalate' }
    isLoading: false,
    error: null,
    showTicketForm: false,
    prefillIssue: '',
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.showTicketForm = false;
      state.prefillIssue = '';
    },
    openTicketForm: (state, action) => {
      state.showTicketForm = true;
      state.prefillIssue = action.payload || '';
    },
    closeTicketForm: (state) => {
      state.showTicketForm = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { type, message } = action.payload;
        state.messages.push({ role: 'assistant', content: message, type });
        if (type === 'escalate') {
          state.prefillIssue = state.messages
            .filter((m) => m.role === 'user')
            .map((m) => m.content)
            .join('\n');
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'assistant',
          content: action.payload || 'Something went wrong. Please try again.',
          type: 'error',
        });
      });
  },
});

export const {
  toggleChat,
  openChat,
  closeChat,
  addUserMessage,
  clearChat,
  openTicketForm,
  closeTicketForm,
} = chatSlice.actions;

export default chatSlice.reducer;
