import { addressActionTypes } from "../actionTypes/connectiActionTypes";
import { ModalActionTypes } from "../actionTypes/modalActionTypes";

export const handlesetConnectedWalletType = (action) => {
  return {
    type: addressActionTypes.SET_CONNECTED_WALLET_TYPE,
    payload: action,
  };
};

export const handlesetConnectedWallet = (action) => {
  return {
    type: addressActionTypes.SET_CONNECTED,
    payload: action,
  };
};

export const handlesetAddressWallet = (action) => {
  return {
    type: addressActionTypes.SET_ADDRESS_NETWORK,
    payload: action,
  };
};
