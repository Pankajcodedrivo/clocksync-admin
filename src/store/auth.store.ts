import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  fullName: string;
  role: string;
  email: string;
  notification: boolean;
  isEmailVerified: boolean;
  firstTimeLogin: boolean;
  isAccountVerified: boolean;
  profileimageurl: string;
  about: any;
  id:any
};

export type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  isSwitchedUser: false, 
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isSwitchedUser: false, 
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
    setSwitchedUser: (state, action) => {
      state.isSwitchedUser = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { logOut, setUser,setSwitchedUser } = authSlice.actions;
export default authSlice.reducer;
