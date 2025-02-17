import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceSlice"; // Import the reducer

const store = configureStore({
    reducer: {
        invoices: invoiceReducer, // Add invoice slice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;