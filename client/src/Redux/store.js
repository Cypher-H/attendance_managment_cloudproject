import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";

import { authReducer } from "./Reducers/authReducer";
import { profileReducer } from "./Reducers/profileReducer";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth", "profile"],
};

const rootReducers = combineReducers({ auth: authReducer, profile: profileReducer });

const pReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

const persistor = persistStore(store);

export { store, persistor };
