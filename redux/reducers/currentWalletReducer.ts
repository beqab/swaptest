import { addressActionTypes } from "../actionTypes/connectiActionTypes";

let currentWallet = null;
let address = null;
if (typeof window !== "undefined") {
  currentWallet = localStorage.getItem("currentWallet");
  address = localStorage.getItem("address");
}

export interface UserState {
  currentWallet: string;
  isConnectedWallet: boolean;
  address: string;
}

const initialState: UserState = {
  currentWallet: currentWallet,
  isConnectedWallet: false,
  address: address,
};

const currentWalletReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case addressActionTypes.SET_CONNECTED_WALLET_TYPE:
      localStorage.setItem("currentWallet", action.payload);
      return { ...state, currentWallet: action.payload };

    case addressActionTypes.SET_CONNECTED:
      return { ...state, isConnectedWallet: action.payload };

    case addressActionTypes.SET_ADDRESS_NETWORK:
      localStorage.setItem("address", action.payload);
      return { ...state, address: action.payload };

    default:
      return state;
  }
};

export default currentWalletReducer;
