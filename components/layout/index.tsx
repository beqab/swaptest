import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "../../connectors";
import Head from "next/head";

import noop from "lodash/noop";
import {
  METAMASK,
  SupportedChainId,
  WALLET_CONNECT,
} from "../../connectors/constants";
import { MESSAGE, METAMASK_DEEPLINK } from "../../constants";

import {
  handleSetLoadingMetamask,
  handleSetModalWrongNetwork,
  handleShowMetamaskNotFound,
} from "../../redux/actions/modalAction";
import { useConnectWallet } from "../hooks/useConnectWallet";
import ModalConnectWallet from "../modal/connectWallet";
import LoadingModal from "../modal/loadMmodal";
import ModalWrapper from "../modal/modalWrapper";
import transactionServices from "../../services/transaction";
import WrongNetworkModal from "../modal/WrongNetWork";
import WrongAccountModal from "../modal/WrongAccountModal";
import showMessage from "../message";
import { handlesetAddressWallet } from "redux/actions/connectWalletAction";
import { AuthActionTypes } from "redux/actionTypes/authActionTypes";

const LayoutApp = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  const {
    isShowConnectModal,
    isShowNotInstallMetamask,
    isShowWrongAccount,
    isShowWrongNetwork,
    isShowLoadingConnectWallet,
    isShowLoadingTransaction,
    isShowLoadingCancelTransaction,
  } = useSelector((state: any) => state.modalReducer);

  const notificationRef = useRef();

  const wallet = useSelector((state: any) => ({
    ...state.authReducer.user,
  }));

  const { address } = useSelector((state: any) => state.currentWalletReducer);

  const currentWallet = useSelector(
    (state: any) => state.currentWalletReducer.currentWallet
  );

  const { account, active, chainId } = useWeb3React();

  const {
    connectInjected,
    connectWalletConnect,
    deactivate: handleDisconnect,
  } = useConnectWallet();

  useEffect(() => {
    if (account) {
      dispatch(handleSetLoadingMetamask(false));
      dispatch(handlesetAddressWallet(account));

      if (!wallet?.game_wallet_address || wallet?.game_wallet_address === "0") {
        console.log("aaa1");

        connectWalletApi();
      }
    }
  }, [account, JSON.stringify(wallet)]);

  const connectWalletApi = async () => {
    try {
      const response = await transactionServices.connectWallet({
        wallet_address: account,
      });
      if (response?.error) {
        showMessage(MESSAGE.ERROR, response?.message);
      } else {
        const user = localStorage.getItem("user") as any;

        localStorage.setItem(
          "user",
          JSON.stringify({ ...JSON.parse(user), game_wallet_address: account })
        );

        dispatch({
          type: AuthActionTypes.SET_USER,
          payload: {
            ...JSON.parse(user),
            game_wallet_address: account,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    walletConnect.on("Web3ReactDeactivate", () => {
      handleDisconnect();
    });

    injected.on("Web3ReactDeactivate", () => {
      handleDisconnect();
    });

    return () => {
      walletConnect.removeListener("Web3ReactDeactivate", noop);
      injected.removeListener("Web3ReactDeactivate", noop);
    };
  }, [active, account]);

  const renderMetamaskNotFoundContent = () => (
    <div className="metamask-notfound-modal modalContain">
      <img
        src="/icons/icon-cancel-white.png"
        onClick={() => {
          dispatch(handleShowMetamaskNotFound(false));
        }}
        className="buttonCancel"
        alt="icon-cancel-white"
      />
      <p className="title">MetaMask Not Found</p>
      <img width={64} height={64} src="/icons/metamask_icon.svg" alt="" />
      <p className="subtitle">
        It seems that you have not installed Metamask wallet. <br /> Please
        install now
      </p>
      <div className="installMetamask">
        <a
          className=""
          href={METAMASK_DEEPLINK}
          target="_blank"
          rel="noreferrer"
        >
          <img src="/icons/download_metamask_icon.svg" alt="" />
          <span>Install Metamask</span>
        </a>
      </div>
    </div>
  );

  useEffect(() => {
    if (address && currentWallet && !active) {
      if (currentWallet === METAMASK) {
        setTimeout(() => connectInjected(), 700);
      }
      if (currentWallet === WALLET_CONNECT) {
        setTimeout(() => connectWalletConnect(), 700);
      }
    }
  }, []);

  const toggleWrongNetworkkModal = (network: any) => {
    if (!chainId) return;

    if (network !== chainId) {
      dispatch(handleSetModalWrongNetwork(true));
    } else {
      dispatch(handleSetModalWrongNetwork(false));
    }
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      toggleWrongNetworkkModal(SupportedChainId.BSC_TESTNET);
    } else {
      toggleWrongNetworkkModal(SupportedChainId.BSC_MAINNET);
    }
  }, [chainId]);

  useEffect(() => {
    if (!account || !wallet.game_wallet_address) {
      return;
    }

    if (account.toLowerCase() !== wallet?.game_wallet_address?.toLowerCase()) {
      (wallet?.game_wallet_address !== "0" ||
        wallet?.game_wallet_address !== null) &&
        showMessage(
          MESSAGE.ERROR,
          "Please connect to the wallet associated with your account to continue"
        );
    }
    return () => clearInterval(notificationRef.current);
  }, [account, JSON.stringify(wallet)]);

  return (
    <>
      <Head>
        {/* <!-- Start of HubSpot Embed Code --> */}
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="https://js.hs-scripts.com/532220.js"
        ></script>
        <script
          async
          defer
          src="https://js.crypto.com/sdk?publishable-key=pk_test_omjKMNNHHhTW4Z8s7RCDhC4J"
        ></script>
        {/* <!-- End of HubSpot Embed Code --> */}
      </Head>
      <ModalWrapper
        childrenProp={<ModalConnectWallet />}
        visible={isShowConnectModal}
        isShowButtonClose={false}
      />
      <ModalWrapper
        childrenProp={<LoadingModal />}
        visible={
          isShowLoadingConnectWallet ||
          isShowLoadingTransaction ||
          isShowLoadingCancelTransaction
        }
        isShowButtonClose={false}
      />
      <ModalWrapper
        childrenProp={renderMetamaskNotFoundContent()}
        visible={isShowNotInstallMetamask}
        isShowButtonClose={false}
      />
      <ModalWrapper
        childrenProp={<WrongNetworkModal />}
        visible={isShowWrongNetwork}
        isShowButtonClose={false}
      />
      <WrongAccountModal visibleModal={isShowWrongAccount}></WrongAccountModal>
      {children}
    </>
  );
};

export default LayoutApp;
