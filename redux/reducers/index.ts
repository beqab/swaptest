import { combineReducers } from "redux";
import authReducer from "./authReducer";
import modalReducer from "./modalReducer";
import currentWalletReducer from "./currentWalletReducer";

const reducers = combineReducers({
  authReducer,
  modalReducer,
  currentWalletReducer,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
