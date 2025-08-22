import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  fullName: string;
  role: string;
  email: string;
  notification: boolean;
  isEmailVerified: boolean;
  isAccountVerified: boolean;
  profileimageurl: string;
  about: any;
};

export type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
  },
  extraReducers: () => {},
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
