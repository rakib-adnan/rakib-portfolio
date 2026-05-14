// @ts-nocheck
import { configureStore } from '@reduxjs/toolkit'
import { portfolioApi } from '../services/portfolioApi'

export const store = configureStore({
  reducer: {
    [portfolioApi.reducerPath]: portfolioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'portfolioApi/executeQuery/fulfilled',
          'portfolioApi/executeMutation/fulfilled',
        ],
      },
    }).concat(portfolioApi.middleware),
})
