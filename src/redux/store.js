import { configureStore } from '@reduxjs/toolkit';
import leasingReducer, { saveState } from './leasingSlice';

const store = configureStore({
  reducer: {
    leasing: leasingReducer,
  },
});

// Subscribe to store changes to save to localStorage
store.subscribe(() => {
  saveState(store.getState().leasing);
});

export default store;