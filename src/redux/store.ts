import { configureStore,combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userSlice from "./userSlice";
import appointmentSlice from "./appointmentSlice";
import availabilitySlice from "./availabilitySlice";
import chatSlice from "./chatSlice";


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userStore','availabilityStore']
};


const rootReducer = combineReducers({ 
     userStore: userSlice.reducer,
     chatStore: chatSlice.reducer,
     appointmentStore: appointmentSlice.reducer,
     availabilityStore: availabilitySlice.reducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools : true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export const persistor = persistStore(store);
export type IRootState = ReturnType<typeof rootReducer>;