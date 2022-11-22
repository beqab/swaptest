import { useWeb3React } from "@web3-react/core";
import { Tooltip } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { shortenAddress } from "utils";
import { handleShowConnectModal } from "redux/actions/modalAction";
import { useConnectWallet } from "../hooks/useConnectWallet";
const Header = () => {
  const { account } = useWeb3React();
  const { deactivate: handleDisconnect } = useConnectWallet();
  const [copied, setCopied] = useState(false);
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));

  const dispatch = useDispatch();

  const handleConnectWallet = () => {
    dispatch(handleShowConnectModal(true));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-color">
      <a className="navbar-brand col-2 p-0" href="#">
        <img src="/images/logo.png" alt="" height="60px" />
      </a>
      {user?.game_access_token && (
        <div className="connectHeader">
          {account &&
          account?.toLowerCase() ===
            user?.game_wallet_address?.toLowerCase() ? (
            <div className="adressContain addressContainMobile">
              <div className="border"></div>
              <img src="/icons/icon-wallet.png" className="icon"alt="icon-wallet"></img>
              <div className="address">
                <Tooltip
                  placement="top"
                  title={!copied ? "Copy Address" : "Copied"}
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
                    <span>{shortenAddress(account)}</span>
                  </CopyToClipboard>
                </Tooltip>
                <div className="divide"></div>
                <img
                  onClick={handleDisconnect}
                  src="/icons/icon-disconnect.svg"
                  alt=""
                  className="iconDisconnect"
                />
              </div>
            </div>
          ) : (
            <button
              className="btn aogBtn btn-primary w-100 mt-3 mb-3 btnConnectWallet"
              onClick={handleConnectWallet}
            >
              <img src="/icons/icon-wallet.png" alt="" />
              Connect wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
