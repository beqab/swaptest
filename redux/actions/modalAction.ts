import { ModalActionTypes } from "../actionTypes/modalActionTypes";

export const handleShowConnectModal = (action) => {
  return {
    type: ModalActionTypes.SHOW_CONNECT_MODAL,
    payload: action,
  };
};
export const handleSetLoadingMetamask = (action) => {
  return {
    type: ModalActionTypes.LOADING_METAMASK,
    payload: action,
  };
};
export const handleShowMetamaskNotFound = (action) => {
  return {
    type: ModalActionTypes.METAMASK_NOT_FOUND,
    payload: action,
  };
};

export const handleSetLoadingTransaction = (action) => {
  return {
    type: ModalActionTypes.LOADING_TRANSACTION,
    payload: action,
  };
};

export const handleSetLoadingCancelTransaction = (action) => {
  return {
    type: ModalActionTypes.LOADING_CANCEL_TRANSACTION,
    payload: action,
  };
};

export const handleSetModalWrongNetwork = (action) => {
  return {
    type: ModalActionTypes.WRONG_NETWORK,
    payload: action,
  };
};

export const handleSetModalWrongAccount = (action) => {
  return {
    type: ModalActionTypes.WRONG_ACCOUNT,
    payload: action,
  };
};
