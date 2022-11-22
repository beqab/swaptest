import { ModalActionTypes } from "../actionTypes/modalActionTypes";

interface IState {
  isShowConnectModal: boolean;
  isShowNotInstallMetamask: boolean;
  isShowWrongNetwork: boolean;
  isShowWrongAccount: boolean;
  isShowLoadingConnectWallet: boolean;
  isShowLoadingTransaction: boolean;
  isShowLoadingCancelTransaction: boolean;
}
const initialState: IState = {
  isShowConnectModal: false,
  isShowNotInstallMetamask: false,
  isShowWrongAccount: false,
  isShowWrongNetwork: false,
  isShowLoadingConnectWallet: false,
  isShowLoadingTransaction: false,
  isShowLoadingCancelTransaction: false,
};

const modalReducer = (state = initialState, action: any): IState => {
  switch (action.type) {
    case ModalActionTypes.SHOW_CONNECT_MODAL:
      return { ...state, isShowConnectModal: action.payload };

    case ModalActionTypes.LOADING_METAMASK:
      return { ...state, isShowLoadingConnectWallet: action.payload };

    case ModalActionTypes.LOADING_TRANSACTION:
      return { ...state, isShowLoadingTransaction: action.payload };

    case ModalActionTypes.LOADING_CANCEL_TRANSACTION:
      return { ...state, isShowLoadingCancelTransaction: action.payload };

    case ModalActionTypes.METAMASK_NOT_FOUND:
      return { ...state, isShowNotInstallMetamask: action.payload };

    case ModalActionTypes.WRONG_ACCOUNT:
      return { ...state, isShowWrongAccount: action.payload };

    case ModalActionTypes.WRONG_NETWORK:
      return { ...state, isShowWrongNetwork: action.payload };
    default:
      return state;
  }
};

export default modalReducer;
