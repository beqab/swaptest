import { MESSAGE } from "@constant/s";
import { useWeb3React } from "@web3-react/core";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getErrorConnectMessage } from "../../connectors";
import { METAMASK, WALLET_CONNECT } from "../../connectors/constants";
import { handlesetConnectedWalletType } from "../../redux/actions/connectWalletAction";
import {
  handleSetLoadingMetamask,
  handleShowConnectModal,
  handleShowMetamaskNotFound,
} from "../../redux/actions/modalAction";
import { shortenAddress } from "../../utils";
import AppButton from "../button";
import { useConnectWallet } from "../hooks/useConnectWallet";
import showMessage from "../message";
import { CopyToClipboard } from "react-copy-to-clipboard";
declare global {
  interface Window {
    ethereum: any;
  }
}
const ModalConnectWallet = () => {
  const dispatch = useDispatch();
  const { connectInjected, connectWalletConnect } = useConnectWallet();
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));
  const { library, account, active } = useWeb3React();
  const [copied, setCopied] = useState(false);

  const handleConnectMetamask = () => {
    if (!window?.ethereum?.isMetaMask) {
      dispatch(handleShowMetamaskNotFound(true));
      return dispatch(handleShowConnectModal(false));
    } else if (
      account &&
      account?.toLowerCase() !== user?.game_wallet_address?.toLowerCase()
    ) {
      user?.game_wallet_address !== "0" &&
        showMessage(
          MESSAGE.ERROR,
          "Please connect to the wallet associated with your account to continue"
        );
      dispatch(handleShowConnectModal(false));
      dispatch(handleSetLoadingMetamask(true));
      setTimeout(() => dispatch(handleSetLoadingMetamask(false)), 500);
    } else {
      dispatch(handleShowConnectModal(false));
      connectInjected(
        undefined,
        () => {
          dispatch(handlesetConnectedWalletType(METAMASK));
          dispatch(handleSetLoadingMetamask(true));
        },
        () => {
          dispatch(handleSetLoadingMetamask(false));
          //showMessage(MESSAGE.ERROR, "Connect fail");
        }
      );
    }
  };

  const handleConnectWallet = () => {
    dispatch(handleShowConnectModal(false));
    connectWalletConnect();
    dispatch(handlesetConnectedWalletType(WALLET_CONNECT));
  };

  const handleCancel = () => {
    dispatch(handleShowConnectModal(false));
  };

  return (
    <div className="connectWallet">
      <img
        onClick={handleCancel}
        src="/icons/icon-cancel-white.png"
        className="btnCancel"
        alt=""
      />
      <div className="title">Connect Wallet</div>
      <div className="subtitle">
        Please connect your wallet to continue. The system supports the
        following wallets:
      </div>
      <AppButton
        text={"Metamask"}
        onClick={handleConnectMetamask}
        variant="default"
        prefixIcon={<img src="/icons/metamask_icon.svg" alt="" />}
      />
      <AppButton
        text={"WalletConnect"}
        onClick={handleConnectWallet}
        variant="default"
        prefixIcon={<img src="/icons/walletconnect_icon.svg" alt="walletconnect_icon"/>}
      />
      <div className="note">
        <span className="noteBig">Note:</span>
        {user?.game_wallet_address && user?.game_wallet_address !== "0" && (
          <span className="noteConnected">
            Please connect your wallet to the wallet of{" "}
            <Tooltip
              placement="top"
              title={!copied ? "Copy Address" : "Copied"}
              className="shortAddress"
            >
              <CopyToClipboard
                text={user?.game_wallet_address}
                onCopy={() => {
                  setCopied(true),
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                }}
              >
                <span>{shortenAddress(user?.game_wallet_address)}</span>
              </CopyToClipboard>
            </Tooltip>
            with your account
          </span>
        )}

        {(!user?.game_wallet_address || user?.game_wallet_address === "0") && (
          <span className="noteNotConnect">
            On successful wallet connection, the connected wallet will linked to
            your account. After that, you can only connect to this wallet
          </span>
        )}
      </div>
    </div>
  );
};

export default ModalConnectWallet;
