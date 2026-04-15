import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";

const isBrowser = typeof window != "undefined";


// Login async thunk
export const login = createAsyncThunk("admin/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.login(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Check logged-in user
export const checkUser = createAsyncThunk("admin/checkUser", async () => {
  try {
    const response = await api.checkUser();
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Fetch all firms/users
export const getAllFirms = createAsyncThunk("admin/getAllFirms", async () => {
  try {
    const response = await api.getAllFirms();
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Add new firm
export const addFirms = createAsyncThunk("admin/addFirms", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addFirms(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update firm access
export const updateFirmsAccess = createAsyncThunk("admin/updateFirmsAccess", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirmsAccess(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Suspend/Unsuspend firm
export const updateSuspendStatus = createAsyncThunk("admin/updateSuspendStatus", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateSuspendStatus(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update firm details
export const updateFirm = createAsyncThunk("admin/updateFirm", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirm(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete firm
export const deleteFirm = createAsyncThunk("admin/deleteFirm", async (id, { rejectWithValue }) => {
  try {
    const response = await api.deleteFirm(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch all notifications
export const getAllNotification = createAsyncThunk("admin/getAllNotification", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllNotification();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Mark a notification as read
export const markAsRead = createAsyncThunk("admin/markAsRead", async (notification_id, { rejectWithValue }) => {
  try {
    const response = await api.markAsRead(notification_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch all subscriptions
export const getAllSubscriptions = createAsyncThunk(
  "admin/getAllSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getSubscriptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    allFirmsUsers: [],
    notification: [],
    subscriptions: [],
    userLogedOut: isBrowser ? !localStorage.getItem("trust-superAdmin") : true,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = false;
        state.admin = action.payload;

        // Save superadmin token in localStorage
        if (typeof window != "undefined") {
          if (action?.payload?.role == "superadmin") {
            localStorage.setItem("trust-superAdmin", JSON.stringify({ "token": action?.payload?.token, "role": action.payload?.role }));
          } else {
            toast.error("Invalid Credential");
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message); // Show error toast
      })

      // 🔹 Check User cases
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;

        // If not superadmin, force logout
        if (action?.payload?.user?.role != "superadmin") {
          toast.error("session expired, please login again!");
          localStorage.removeItem("trust-superAdmin");
          setTimeout(() => { window.location.href = '/'; }, 1000);
        }
      })
      .addCase(checkUser.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
      })

      // 🔹 Get All Firms
      .addCase(getAllFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFirms.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allFirmsUsers = action?.payload?.data; // Update all firms/users
      })
      .addCase(getAllFirms.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        if (typeof window != "undefined") {
          toast.error("session expired, please login again!");
          localStorage.removeItem("trust-superAdmin");
        }
        setTimeout(() => { window.location.href = '/'; }, 1000);
      })

      // 🔹 Add Firm
      .addCase(addFirms.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addFirms.fulfilled, (state, action) => { state.loading = false; toast.success(action?.payload?.message); })
      .addCase(addFirms.rejected, (state, action) => { state.loading = false; toast.error(action?.payload?.message); })

      // 🔹 Update Firms Access
      .addCase(updateFirmsAccess.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateFirmsAccess.fulfilled, (state, action) => { state.loading = false; toast.success(action?.payload?.message); })
      .addCase(updateFirmsAccess.rejected, (state, action) => { state.loading = false; toast.error(action?.payload?.message); })

      // 🔹 Update Suspend Status
      .addCase(updateSuspendStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSuspendStatus.fulfilled, (state, action) => { state.loading = false; toast.success(action?.payload?.message); })
      .addCase(updateSuspendStatus.rejected, (state, action) => { state.loading = false; toast.error(action?.payload?.message); })

      // 🔹 Update Firm
      .addCase(updateFirm.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateFirm.fulfilled, (state) => { state.loading = false; })
      .addCase(updateFirm.rejected, (state) => { state.loading = false; })

      // 🔹 Delete Firm
      .addCase(deleteFirm.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteFirm.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteFirm.rejected, (state) => { state.loading = false; })

      // 🔹 Get All Notifications
      .addCase(getAllNotification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllNotification.fulfilled, (state, action) => { state.loading = false; state.notification = action?.payload?.data; })
      .addCase(getAllNotification.rejected, (state) => { state.loading = false; })

      // 🔹 Mark as Read
      .addCase(markAsRead.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markAsRead.fulfilled, (state) => { state.loading = false; })
      .addCase(markAsRead.rejected, (state) => { state.loading = false; })

      // 🔹 Get All Subscriptions
      .addCase(getAllSubscriptions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllSubscriptions.fulfilled, (state, action) => { state.loading = false; state.subscriptions = action?.payload?.data; })
      .addCase(getAllSubscriptions.rejected, (state) => { state.loading = false; state.error = true; state.subscriptions = []; })
  },
});

export default authSlice.reducer;
