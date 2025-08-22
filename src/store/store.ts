import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import themeSlice from "./theme.store";
import authSlice from "./auth.store";
import sideBarSlice from "./sidebar.store";
import langSlice from "./lang.store";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

const persistConfig = {
  key: "storeName",
  storage,
  whitelist: ["authSlice"],
};

const combinedReducers = persistReducer(
  persistConfig,
  combineReducers({
    themeSlice,
    authSlice,
    sideBarSlice,
    langSlice,
  })
);

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});
export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
