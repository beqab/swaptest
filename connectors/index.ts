import { UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import {
  APP_NETWORKS_SUPPORT,
  BASE_SCAN_URLS,
  BRIDGE_WALLET_CONNECT_URL,
  CHAIN_ID,
  LIST_NETWORK_RPC_MAINNET,
  LIST_NETWORK_RPC_TESTNET,
  NETWORK_CONFIG,
  SupportedChainId,
} from "./constants";
import showMessage from "../components/message";
import { MESSAGE } from "../constants";

export const injected = new InjectedConnector({});
const POLLING_INTERVAL = 12000;

export const walletConnect = new WalletConnectConnector({
  rpc:
    process.env.NEXT_PUBLIC_NODE_ENV === "development"
      ? LIST_NETWORK_RPC_TESTNET
      : LIST_NETWORK_RPC_MAINNET,
  bridge: BRIDGE_WALLET_CONNECT_URL,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export function getErrorConnectMessage(
  error: Error,
  deactivate: any,
  metamaskNotFound?: any
) {
  if (error instanceof NoEthereumProviderError) {
    return metamaskNotFound && metamaskNotFound();
  } else if (error instanceof UnsupportedChainIdError) {
    return;
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return;
  } else {
    console.error(error);
    return showMessage(
      MESSAGE.ERROR,
      "An unknown error occurred. Check the console for more details."
    );
  }
}

import { ExternalProvider } from "@ethersproject/providers";

export const setupNetwork = async (externalProvider?: ExternalProvider) => {
  const provider = externalProvider || window.ethereum;
  const chainId = parseInt(CHAIN_ID);
  console.log("chainId", chainId);

  const networkInfo = APP_NETWORKS_SUPPORT[Number(CHAIN_ID)];
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{ ...networkInfo.details }],
          });
          return true;
        } catch (error) {
          console.error("Failed to setup the network in Metamask:", error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error(
      "Can't setup the ETH network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
