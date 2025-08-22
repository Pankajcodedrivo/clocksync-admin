import { createSlice } from "@reduxjs/toolkit";

interface IBarType {
  isOpen: boolean;
}
const initialState: IBarType = {
  isOpen: true,
};

const sideBarSlice = createSlice({
  name: "sideBarSlice",
  initialState,
  reducers: {
    handleBar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: () => {},
});

export const { handleBar } = sideBarSlice.actions;
export { sideBarSlice };
export default sideBarSlice.reducer;
