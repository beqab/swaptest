import { useMemo } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected, walletConnect } from "../../connectors";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { injected, walletConnect } from 'connectors';
import { useDispatch, useSelector } from "react-redux";
import {
  handlesetAddressWallet,
  handlesetConnectedWalletType,
} from "redux/actions/connectWalletAction";
import {
  handleSetLoadingMetamask,
  handleSetModalWrongNetwork,
} from "redux/actions/modalAction";

export const useConnectWallet = () => {
  const { activate, deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const connect = useMemo(() => {
    return {
      connectInjected(
        metamaskNotFound?: any,
        callbackSuccess?: any,
        callbackError?: any
      ): void {
        injected.isAuthorized().then(async (isAuthorized: boolean) => {
          callbackSuccess && callbackSuccess();
          await activate(injected, undefined, true).catch((error) => {
            callbackError && callbackError();
          });
        });
      },

      connectWalletConnect(callback?: { failed: (err: any) => void }): void {
        if (
          walletConnect instanceof WalletConnectConnector &&
          walletConnect.walletConnectProvider?.wc?.uri
        ) {
          walletConnect.walletConnectProvider = undefined;
        }

        walletConnect &&
          activate(walletConnect, undefined, true).catch(async (error) => {
            console.log("error connect wallet", error);
            if (error instanceof UnsupportedChainIdError) {
              deactivate();
              localStorage.removeItem("currentWallet");
              dispatch(handleSetModalWrongNetwork(true));
              // await activate(walletConnect, undefined, true).catch((error) => console.log(error, 'error'));

              callback && callback.failed(error);
            }
          });
      },
      deactivate(): void {
        deactivate();
        dispatch(handlesetConnectedWalletType(""));
        dispatch(handlesetAddressWallet(""));
        localStorage.removeItem("currentWallet");
        localStorage.removeItem("walletconnect");
        localStorage.removeItem("address");
        dispatch(handleSetModalWrongNetwork(false));
        dispatch(handleSetLoadingMetamask(false));
        walletConnect.walletConnectProvider = undefined;
      },
    };
  }, []);

  return connect;
};
