import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";

import { authReducer } from "./Reducers/authReducer";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth"],
};

const rootReducers = combineReducers({ auth: authReducer });

const pReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

const persistor = persistStore(store);

export { store, persistor };
