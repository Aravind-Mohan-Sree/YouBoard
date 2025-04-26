import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userId: "",
  name: "",
  imageUrl: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    resetAuth: () => initialState,
  },
});

export const {
  setIsAuthenticated,
  setUserId,
  setName,
  setImageUrl,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
