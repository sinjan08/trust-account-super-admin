import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";

// 🔹 Utility function to handle unauthenticated users
function logouterror() {
  toast.error("Token Expired"); // Show toast message
  localStorage.removeItem("nfc-admin"); // Clear localStorage
  setTimeout(() => {
    window.location.href = "/"; // Redirect to login after 1s
  }, 1000);
}

// 🔹 Async Thunks

// Get all users
export const getAllUser = createAsyncThunk("user/getAllUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllUser(); // API call to fetch users
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message); // Handle errors
  }
});

// Get next available User ID
export const getUserId = createAsyncThunk("user/userId", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getUserId(); // API call to get user ID
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Create a new user
export const createUser = createAsyncThunk("user/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createUser(formData); // API call to create user
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit an existing user
export const editUser = createAsyncThunk("user/editUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editUser(formData); // API call to edit user
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete a user
export const deleteUser = createAsyncThunk("user/delete", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.deleteUser(userData); // API call to delete user
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Slice definition
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [], // Stores all user data
    loading: false, // Global loading state
    error: null, // Error state
    message: null, // Success messages
    userIdAndUrl: null, // Stores user ID and related URL for creation/editing
  },
  reducers: {}, // No local reducers; all handled via extraReducers
  extraReducers: (builder) => {
    builder
      // 🔹 Get All Users
      .addCase(getAllUser.pending, (state) => {
        state.loading = true; // Set loading true while fetching
        state.error = null; // Clear previous errors
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false; // Loading complete
        state.user = action.payload; // Update user list
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users"; // Update error state
        if (action.payload.message == "Unauthenticated.") logouterror(); // Handle token expiry
      })

      // 🔹 Get User ID for creation/edit
      .addCase(getUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userIdAndUrl = action.payload.data; // Save user ID info
      })
      .addCase(getUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") logouterror();
      })

      // 🔹 Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update users list
        state.message = "User created successfully";
        toast.success(action.payload.message || "User created successfully"); // Show success toast
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "User creation failed"; // Capture validation errors
        if (action.payload.message == "Unauthenticated.") logouterror();
      })

      // 🔹 Edit User
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update users list after edit
        state.message = "User updated successfully";
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if (action.payload.message == "Unauthenticated.") logouterror();
      })

      // 🔹 Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update users list after deletion
        state.message = "User Deleted successfully";
        toast.success(action.payload.message || "User deleted successfully"); // Show success toast
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
        toast.error(action.payload.message || "Failed to delete user"); // Show error toast
        if (action.payload.message == "Unauthenticated.") logouterror();
      });
  },
});

export default userSlice.reducer;
