import { createSlice } from "@reduxjs/toolkit";

interface IthemeType {
  theme: string;
}
const initialState: IthemeType = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    updateTheme: (state, action) => {
      state.theme = action.payload;
      document.documentElement.setAttribute("theme", action.payload);
    },
  },
  extraReducers: () => {},
});

export const { updateTheme } = themeSlice.actions;
export { themeSlice };
export default themeSlice.reducer;
