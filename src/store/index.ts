import { configureStore } from '@reduxjs/toolkit';
import gradesReducer from './gradesSlice';

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    grades: gradesReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;