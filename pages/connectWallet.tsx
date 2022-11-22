import React from "react";
import Header from "../components/header";
import { FormGroup } from "../components/common/form/formGroup";
import { Button } from "../components/common/form/button";
import { Input } from "../components/common/form/index";
import Link from "next/link";
import SideMenu from "../components/asideMenu/index";
import MobilePageMenu from "../components/mobilePageMenu";
import { UseCheckAuth } from "../components/hooks/useCheckAuth";
import { useDispatch } from "react-redux";
import { handleShowConnectModal } from "../redux/actions/modalAction";
import { useWeb3React } from "@web3-react/core";

const ConnectWallet = () => {
  UseCheckAuth();
  const dispatch = useDispatch();
  const { account, active } = useWeb3React();
  const handleConnectWallet = () => {
    dispatch(handleShowConnectModal(true));
  };

  return (
    <>
      <div className="d-block d-md-none">
        <Header />
      </div>
      <div className="withAsideMenu pageBg pageBgPoseidon aogPage d-block d-md-flex">
        <MobilePageMenu />
        <SideMenu />
        <section className="d-flex align-items-center justify-content-center">
          <div>
            <h2>Connect your wallet</h2>
            <p className="text-center">Trade tokens in an instant</p>
            <button
              className="btn aogBtn btn-primary w-100 mt-3 mb-3 px-4"
              onClick={handleConnectWallet}
            >
              Connect your wallet
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ConnectWallet;
