import { configureStore } from "@reduxjs/toolkit";
import { addressApi } from "../server/APIs";
import { brandApi } from "../server/APIs";
import { bookingApi } from "../server/APIs";
import { laptopbrandApi } from "../server/APIs";
import { accessoriesBrandApi, televisionBrandApi, refrigeratorBrandApi } from "../server/APIs"


export const store = configureStore({
  reducer: {
    [addressApi.reducerPath]: addressApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [laptopbrandApi.reducerPath]: laptopbrandApi.reducer,
    [accessoriesBrandApi.reducerPath]: accessoriesBrandApi.reducer,
    [televisionBrandApi.reducerPath]: televisionBrandApi.reducer,
    [refrigeratorBrandApi.reducerPath]: refrigeratorBrandApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      addressApi.middleware,
      brandApi.middleware,
      laptopbrandApi.middleware,
      accessoriesBrandApi.middleware,
      televisionBrandApi.middleware,
      refrigeratorBrandApi.middleware,
      bookingApi.middleware
    ),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
