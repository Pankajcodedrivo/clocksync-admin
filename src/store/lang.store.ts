import { createSlice } from "@reduxjs/toolkit";
import i18n from "../locale";

interface IAuthType {
  lang: "en" | "fa";
}
const initialState: IAuthType = {
  lang: "en",
};

const langSlice = createSlice({
  name: "langSlice",
  initialState,
  reducers: {
    setLang: (state, action) => {
      state.lang = action.payload;
      i18n.changeLanguage(action.payload);
    },
  },
  extraReducers: () => {},
});

export const { setLang } = langSlice.actions;
export { langSlice };
export default langSlice.reducer;
