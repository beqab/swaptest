import React, { useEffect, useState } from "react";
import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useConnectWallet } from "../hooks/useConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { handleShowConnectModal } from "redux/actions/modalAction";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { shortenAddress } from "utils";
import { useWeb3React } from "@web3-react/core";
import { Tooltip } from "antd";
import { AuthService } from "services/auth/auth.http";
import { setUserSignOut } from "redux/actions";
import { handlesetAddressWallet } from "redux/actions/connectWalletAction";

const SideMenu = () => {
  const { deactivate: handleDisconnect } = useConnectWallet();
  const [copy, setCopy] = useState(false);
  const router = useRouter();
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));
  const { account } = useWeb3React();
  const [copied, setCopied] = useState(false);

  const Logout = async () => {
    deactivate();
    try {
      await AuthService.logout({
        logout_type: 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("game_access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setUserSignOut(""));
      dispatch(handlesetAddressWallet(""));
      router.push("/login");
    }
  };

  const handleConnectWallet = () => {
    dispatch(handleShowConnectModal(true));
  };
  return (
    <aside className="sideMenu d-none d-md-block">
      <h1>
        <img width={64} src="./images/logo.png" alt="icon-wallet" />
      </h1>
      <ul>
        <li className="menu">
          {account &&
          account?.toLowerCase() ===
            user?.game_wallet_address?.toLowerCase() ? (
            <div className="adressContain">
              <div className="border"></div>
              <img
                src="/icons/icon-wallet.png"
                className="icon"
                alt="icon-wallet"
              ></img>
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
        </li>

        <li>
          <Link href={"https://ageofgods.net/"}>
            <a>
              <img src="/icons/icon-home.svg" alt="" className="icon-menu" />
              <span>Home</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="https://play.ageofgods.net/">
            <a target="_blank">
              <svg
                style={{
                  width: "20px",
                  marginLeft: "13px",
                  marginRight: "9px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                width={10}
                viewBox="0 0 640 512"
              >
                <path
                  fill="#fff"
                  d="M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"
                />
              </svg>
              <span>Play AgeOfGods</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href={"/swap"}>
            <a
              className={classnames({
                active:
                  router.pathname === "/swap" ||
                  router.pathname === "/swapHistory",
              })}
            >
              <img
                src="/icons/icon-swap-menu.svg"
                alt=""
                className="icon-menu"
              />
              <span>Swap</span>
            </a>
          </Link>
        </li>

        {/* <li>
          <Link href={"/buy"}>
            <a
              className={classnames({
                active: router.pathname === "/buy",
              })}
            >
              <img src="/icons/coin.svg" alt="" className="icon-menu" />
              <span>Buy GAOG tokens</span>
            </a>
          </Link>
        </li> */}
        <li className="menuConnectWallet">
          <Link href={"/connectWallet"}>
            <a
              className={classnames({
                active: router.pathname === "/connectWallet",
              })}
            >
              <img
                src="/icons/icon-connect-menu.svg"
                alt=""
                className="icon-menu"
              />
              <span>Connect wallet</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href={"/my-nft"}>
            <a
              className={classnames({
                active: router.pathname === "/profile",
              })}
            >
              <img src="/icons/icon-profile.svg" alt="" className="icon-menu" />
              <span> My NFTs</span>
            </a>
          </Link>
        </li>

        <li>
          <Link href={"/"}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                Logout();
              }}
            >
              <img
                src="/icons/icon-sign-out.svg"
                alt=""
                className="icon-menu"
              />

              <span>Sign out</span>
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
