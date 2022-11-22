import React, { useEffect, useState } from "react";
import Header from "../components/header";
import SideMenu from "../components/asideMenu/index";
import SwapMenu from "../components/swapMenu";
import { UseCheckAuth } from "../components/hooks/useCheckAuth";
import MobilePageMenu from "../components/mobilePageMenu";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { LIMIT_AMOUT_TOKEN_SWAP, MESSAGE, TOKEN } from "../constants";
import NumberFormat from "../components/NumberFormat";
import { multipleTwoBigNumber } from "../utils";
import ConnectWallet from "./connectWallet";
import ModalWrapper from "../components/modal/modalWrapper";
import BigNumber from "bignumber.js";
import SuccessModal from "../components/modal/successModal";
import RejectModal from "../components/modal/rejectModal";
import { UseConfirmHook } from "@components//pages/swap/hook/useConfirmHook";
import ModalSwapConfirm from "@components//pages/swap/ModalConfirm";
import Link from "next/link";
import SwapHistory from "./swapHistory";
import showMessage from "@components//message";
import { Button } from "antd";
import UseApproveHook from "@components//pages/swap/hook/usApproveHook";
import UseSwapHistoryHook from "@components//pages/swapHistory/hook/useSwapHistoryHook";
const Swap = () => {
  const { account } = useWeb3React();
  const [changeSwap, setChangeSwap] = useState(false);
  const [amountTokenSwap, setAmountTokenSwap] = useState() as any;
  const [balanceGaog, setBalanceGaog] = useState(0);
  const [balanceAog, setBalanceAog] = useState(0);
  const [tokenSending, setTokenSending] = useState("AOG");
  const [tokenReceiving, setTokenReceiving] = useState("gAOG");
  const [displayBalanceAog, setDisplayBalanceAog] = useState(false);
  const [displayBalanceGaog, setDisplayBalanceGaog] = useState(false);
  const [activeModalSuccess, setActiveModalSuccess] = useState(false);
  const [activeModalFail, setActiveModalFail] = useState(false);
  const [linkViewBsc, setLinkViewBsc] = useState("");
  const [isActiveBtnSwap, setIsActiveBtnSwap] = useState(true);
  const [isActiveBtnCancel, setIsActiveBtnCancel] = useState(false);
  const [listOptionTokenSend, setlistOptionTokenSend] = useState(false);
  const [listOptionTokenReceive, setlistOptionTokenReceive] = useState(false);
  const [activeButtonApprove, setActiveButtonApprove] = useState(true);
  const [messageError, setMessageError] = useState({
    status: false,
    message: "",
  });
  const [changeTab, setChangeTab] = useState(false);
  const [isActiveBtnConfirm, setIsActiveBtnConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));
  const { address } = useSelector((state: any) => state.currentWalletReducer);

  const MAX_LIMIT_GAOG = 40000;
  /////
  const swapAogToGaog =
    (!changeSwap && tokenSending === "AOG") ||
    (changeSwap && tokenReceiving === "AOG");

  const swapGaogToAog =
    (!changeSwap && tokenSending === "gAOG") ||
    (changeSwap && tokenReceiving === "gAOG");

  const {
    isNeedApproveCurrency,
    handleConfirmSuccess,
    handleConfirmFail,
    handleCancelMetamask,
    isTransactionSuccess,
    getAllowanceERC20,
    updateTransaction,
  } = UseConfirmHook({
    setVisibleModalConfirm,
    setAmountTokenSwap,
    setBalanceGaog,
    setMessageError,
    setBalanceAog,
    amountTokenSwap,
    isActiveBtnConfirm,
    displayBalanceAog,
    displayBalanceGaog,
    setActiveModalFail,
    setActiveModalSuccess,
    swapAogToGaog,
    setChangeTab,
  });

  const {
    handleApproveCurrencySuccess,
    handleApproveCurrencyFailed,
    handleCancleApproveMemask,
    handleLoadingApprove,
  } = UseApproveHook({
    setVisibleModalConfirm,
    setIsActiveBtnCancel,
    setIsLoading,
    getAllowanceERC20,
    setActiveButtonApprove,
    setIsActiveBtnConfirm,
  });

  const {
    changeFilter,
    changeSort,
    changePage,
    params,
    sortModal,
    setSortModal,
    filterModal,
    setFilterModal,
    transactions,
    metaData,
    loading,
    setDayFrom,
    dayFrom,
    dayTo,
    setDayTo,
    getTransactionHistory,
  } = UseSwapHistoryHook();

  UseCheckAuth();

  useEffect(() => {
    !address &&
      showMessage(MESSAGE.ERROR, "Please connect your wallet to continue");
  }, [address]);

  const checkBalance = (change) => {
    if (!change) {
      const isNotEnoughBalance = new BigNumber(
        multipleTwoBigNumber(balanceAog)
      ).isLessThan(LIMIT_AMOUT_TOKEN_SWAP);
      if (isNotEnoughBalance) {
        setMessageError({
          status: true,
          message: "You need at least 1 AOG to swap",
        });
      }
    } else {
      setMessageError({
        status: false,
        message: "",
      });
    }
  };

  const changeSwapToken = () => {
    setChangeSwap(!changeSwap);
    setMessageError({
      status: false,
      message: "",
    });
    //checkValidAmount(amountTokenSwap);
  };

  const checkValidAmount = (amount) => {
    const convertBalanceAog = new BigNumber(balanceAog).div(10 ** 18);
    const checkMaxAmountAog = new BigNumber(amount).isGreaterThan(
      convertBalanceAog
    );
    const checkMaxAmountGaog = new BigNumber(amount).isGreaterThan(balanceGaog);
    const checkMinAmountAog = new BigNumber(amount).isLessThan(
      LIMIT_AMOUT_TOKEN_SWAP
    );

    if (
      (swapAogToGaog && (checkMaxAmountAog || checkMinAmountAog)) ||
      (swapGaogToAog && (checkMaxAmountGaog || checkMinAmountAog))
    ) {
      setMessageError({
        status: true,
        message:
          +amount === 0
            ? "Please enter a positive value"
            : checkMinAmountAog
            ? "You need at least 1 AOG to swap"
            : "Insufficient balance",
      });

      return false;
    }
    return true;
  };

  const getAmoutSwap = (e) => {
    // e.preventDefault();
    const amount = e.target.value;

    setMessageError({
      status: false,
      message: "",
    });
    checkValidAmount(amount);
    if (!amount?.match(/^(?![0]{2,})\d{0,9}(\.\d{0,0})?$/)) {
      setIsActiveBtnSwap(true);
    } else {
      setAmountTokenSwap(amount);
      setIsActiveBtnSwap(false);
    }
  };

  const selectNameTokenSending = (nameToken) => {
    setAmountTokenSwap("");
    if (nameToken === "AOG") {
      setDisplayBalanceAog(false);
      setDisplayBalanceGaog(false);
      checkBalance(changeSwap);
    } else {
      checkBalance(!changeSwap);
      setDisplayBalanceAog(true);
      setDisplayBalanceGaog(true);
    }

    if (nameToken === tokenSending) {
      setlistOptionTokenSend(false);
    } else {
      setTokenReceiving(tokenSending);
      setTokenSending(nameToken);
    }
    setlistOptionTokenSend(false);
  };

  const selectNameTokenReceiving = (nameToken) => {
    setAmountTokenSwap("");

    if (nameToken === "AOG") {
      setDisplayBalanceGaog(true);
      setDisplayBalanceAog(true);
      checkBalance(!changeSwap);
    } else {
      setDisplayBalanceGaog(false);
      setDisplayBalanceAog(false);
      checkBalance(changeSwap);
    }

    if (nameToken === tokenReceiving) {
      setlistOptionTokenReceive(false);
    } else {
      setTokenSending(tokenReceiving);
      setTokenReceiving(nameToken);
    }
    setlistOptionTokenReceive(false);
  };

  const checkError = (balance?: string) => () => {
    const isValid = balance || amountTokenSwap;
    if (!isValid) {
      setMessageError({
        status: true,
        message: " Amount paid is required",
      });
    } else {
      setMessageError({
        status: false,
        message: "",
      });
    }
    if (amountTokenSwap) {
      checkValidAmount(amountTokenSwap);
    }
  };

  const clickMaxTokenSwap = () => {
    setIsActiveBtnSwap(false);
    const convertBalanceAog = new BigNumber(balanceAog)
      .div(10 ** 18)
      .toString()
      .split(".")[0];
    if (!changeSwap) {
      if (tokenSending === "AOG") {
        setAmountTokenSwap(convertBalanceAog);
      } else setAmountTokenSwap(balanceGaog);
    } else {
      if (tokenReceiving === "gAOG") setAmountTokenSwap(balanceGaog);
      else setAmountTokenSwap(convertBalanceAog);
    }
    checkError(convertBalanceAog)();
    setMessageError({
      status: false,
      message: "",
    });
  };

  const displayBalanceTokenSend = () => {
    return (
      <label className="d-none d-md-block">
        balance :{" "}
        {swapAogToGaog ? (
          <>
            <NumberFormat
              value={multipleTwoBigNumber(balanceAog)}
              thousandSeparator
              decimalScale={0}
              displayType="text"
            />{" "}
            aog
          </>
        ) : (
          <>
            <NumberFormat
              value={balanceGaog}
              thousandSeparator
              decimalScale={0}
              displayType="text"
            />{" "}
            <span className="balanceText">g</span>aog
          </>
        )}
      </label>
    );
  };

  const displayBalanceTokenReceiving = () => {
    return (
      <label className="d-none d-md-block">
        balance :{" "}
        {!swapGaogToAog ? (
          <>
            <NumberFormat
              value={balanceGaog}
              thousandSeparator
              decimalScale={0}
              displayType="text"
            />{" "}
            <span className="balanceText">g</span>aog
          </>
        ) : (
          <>
            <NumberFormat
              value={multipleTwoBigNumber(balanceAog)}
              thousandSeparator
              decimalScale={0}
              displayType="text"
            />{" "}
            aog
          </>
        )}
      </label>
    );
  };

  const handleSwap = () => {
    if (!checkValidAmount(amountTokenSwap)) {
      checkValidAmount(amountTokenSwap);
    } else setVisibleModalConfirm(true);
  };

  return (
    <>
      {account &&
      account.toLowerCase() === user?.game_wallet_address?.toLowerCase() ? (
        <div
          className="swapPage"
          onClick={() => {
            setActiveModalSuccess(false);
          }}
        >
          <div className="d-block d-md-none">
            <Header />
          </div>
          <ModalWrapper
            isShowButtonClose={false}
            childrenProp={
              <ModalSwapConfirm
                setChangeTab={setChangeTab}
                isNeedApproveCurrency={isNeedApproveCurrency}
                amountTokenSwap={amountTokenSwap}
                swapAogToGaog={swapAogToGaog}
                swapGaogToAog={swapGaogToAog}
                isLoading={isLoading}
                isActiveBtnCancel={isActiveBtnCancel}
                setVisibleModalConfirm={setVisibleModalConfirm}
                setIsActiveBtnCancel={setIsActiveBtnCancel}
                setIsLoading={setIsLoading}
                setAmountTokenSwap={setAmountTokenSwap}
                setLinkViewBsc={setLinkViewBsc}
                setActiveModalFail={setActiveModalFail}
                handleConfirmSuccess={handleConfirmSuccess}
                handleApproveCurrencySuccess={handleApproveCurrencySuccess}
                handleApproveCurrencyFailed={handleApproveCurrencyFailed}
                handleCancleApproveMemask={handleCancleApproveMemask}
                handleLoadingApprove={handleLoadingApprove}
                handleConfirmFail={handleConfirmFail}
                handleCancelMetamask={handleCancelMetamask}
                isTransactionSuccess={isTransactionSuccess}
                updateTransaction={updateTransaction}
                activeButtonApprove={activeButtonApprove}
                isActiveBtnConfirm={isActiveBtnConfirm}
              />
            }
            visible={visibleModalConfirm}
          />
          <ModalWrapper
            isShowButtonClose={false}
            childrenProp={
              <SuccessModal
                setActiveModalSuccess={setActiveModalSuccess}
                linkViewBsc={linkViewBsc}
                amount={amountTokenSwap}
                swapAogToGaog={swapAogToGaog}
                setAmountTokenSwap={setAmountTokenSwap}
              />
            }
            visible={activeModalSuccess}
            type="success"
          />
          <ModalWrapper
            isShowButtonClose={false}
            childrenProp={
              <RejectModal setActiveModalFail={setActiveModalFail} />
            }
            visible={activeModalFail}
            type="danger"
          />

          <div className="withAsideMenu pageBg pageBgPoseidon aogPage d-block d-md-flex">
            <MobilePageMenu />
            <SideMenu />
            <section>
              <SwapMenu
                setChangeTab={setChangeTab}
                changeTab={changeTab}
                setSortModal={setSortModal}
                setFilterModal={setFilterModal}
              />
              {!changeTab ? (
                <>
                  <h2 className="text-center mt-5 pt-5">Swap</h2>
                  <p className="text-center">Trade tokens in an instant</p>
                  <p
                    className="text-center text-center"
                    style={{ fontSize: "13px" }}
                  >
                    Max limit {MAX_LIMIT_GAOG?.toLocaleString()} gAOG
                  </p>
                  <div
                    className={classNames("swapContain", {
                      swapChange: changeSwap,
                    })}
                  >
                    <div className="swapWrapper swaptoken">
                      <div className="d-flex h-flex">
                        <div
                          onClick={() => setlistOptionTokenSend(true)}
                          className="tokenChoose"
                        >
                          {tokenSending}
                          <img src="/icons/icon-down-arrow.svg" alt="" />
                        </div>
                        {listOptionTokenSend && (
                          <div className="listToken">
                            <div className="titleList">
                              Select a Token{" "}
                              <img
                                src="/icons/icon-close-blue.svg"
                                alt=""
                                onClick={() => setlistOptionTokenSend(false)}
                              />
                            </div>
                            {TOKEN.map((val, idx) => (
                              <div
                                key={idx}
                                onClick={() => selectNameTokenSending(val.key)}
                                className="nameToken"
                              >
                                {val.name}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="swapBalance">
                          {!changeSwap
                            ? displayBalanceTokenSend()
                            : displayBalanceTokenReceiving()}
                        </div>
                      </div>
                      <div className="swapInputWrapper">
                        <div className="swapInputContain">
                          <input
                            placeholder="0"
                            type="number"
                            value={amountTokenSwap}
                            onChange={(e) => getAmoutSwap(e)}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                event.preventDefault();
                              }
                            }}
                            onBlur={checkError()}
                            pattern="^\d{0,10}(\.\d{0,2})?$"
                            // disabled={
                            //   changeSwap || balanceAog < LIMIT_AMOUT_TOKEN_SWAP
                            // }
                            name="aog"
                          />
                          {!changeSwap && (
                            <button
                              className="buttonMax"
                              onClick={clickMaxTokenSwap}
                            >
                              Max
                            </button>
                          )}
                        </div>
                        {!changeSwap
                          ? displayBalanceTokenSend()
                          : displayBalanceTokenReceiving()}
                      </div>
                      {messageError.status && !changeSwap && (
                        <div className="error">{messageError.message}</div>
                      )}
                    </div>
                    <div className="reverseSwap">
                      <img
                        src="icons/reverseSwap.svg"
                        alt="reverse swap"
                        onClick={changeSwapToken}
                      />
                    </div>
                    <div className="swapWrapper swaptoken">
                      <div className="d-flex h-flex">
                        <div
                          onClick={() => setlistOptionTokenReceive(true)}
                          className="tokenChoose"
                        >
                          {tokenReceiving}
                          <img src="/icons/icon-down-arrow.svg" alt="" />
                        </div>
                        {listOptionTokenReceive && (
                          <div className="listToken">
                            <div className="titleList">
                              Select a Token{" "}
                              <img
                                src="/icons/icon-close-blue.svg"
                                alt=""
                                onClick={() => setlistOptionTokenReceive(false)}
                              />
                            </div>
                            {TOKEN.map((val, idx) => (
                              <div
                                key={idx}
                                onClick={() =>
                                  selectNameTokenReceiving(val.key)
                                }
                                className="nameToken"
                              >
                                {val.name}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="swapBalance">
                          {changeSwap
                            ? displayBalanceTokenSend()
                            : displayBalanceTokenReceiving()}
                        </div>
                      </div>
                      <div className="swapInputWrapper">
                        <div className="swapInputContain">
                          <input
                            placeholder="0"
                            type="number"
                            name="gaog"
                            value={amountTokenSwap}
                            onChange={(e) => getAmoutSwap(e)}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                event.preventDefault();
                              }
                            }}
                            onBlur={checkError()}
                            //disabled={!changeSwap}
                          />
                          {changeSwap && (
                            <button
                              className="buttonMax"
                              onClick={clickMaxTokenSwap}
                            >
                              Max
                            </button>
                          )}
                        </div>
                        {changeSwap
                          ? displayBalanceTokenSend()
                          : displayBalanceTokenReceiving()}
                      </div>
                      {messageError.status && changeSwap && (
                        <div className="error">{messageError.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="swapWrapper mt-3 ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div className="">
                        <span className="coloBlue">Ratio</span> <span>1:1</span>
                      </div>
                      <label className="wightColor d-block d-md-none">
                        total: 23131{" "}
                      </label>
                    </div>
                  </div>
                  <div className="swapWrapper">
                    <div className="swapInputWrapper  swapInputWrapper_button">
                      <Button
                        disabled={
                          messageError.status ||
                          isActiveBtnSwap ||
                          !amountTokenSwap
                        }
                        icon={<img src="icons/swap.svg" alt="swap" />}
                        // onClick={() => setVisibleModalConfirm(true)}
                        onClick={handleSwap}
                        className="buttonSwap"
                      >
                        Swap
                      </Button>
                    </div>
                  </div>
                  <div className="myHistoryMobile">
                    <a
                      className="buttonSwapHistoy"
                      onClick={() => {
                        setChangeTab(true),
                          setFilterModal(false),
                          setSortModal(false);
                      }}
                    >
                      <button className="btn btn-danger aogBtn  aogBtn-success  btn-primary  mt-3 mb-3 px-4">
                        <img src="/icons/icon-time-history.svg" alt="" /> Swap
                        History
                      </button>
                    </a>
                  </div>
                </>
              ) : (
                <SwapHistory
                  changeFilter={changeFilter}
                  changeSort={changeSort}
                  changePage={changePage}
                  params={params}
                  sortModal={sortModal}
                  setSortModal={setSortModal}
                  filterModal={filterModal}
                  setFilterModal={setFilterModal}
                  transactions={transactions}
                  metaData={metaData}
                  loading={loading}
                  setDayFrom={setDayFrom}
                  dayFrom={dayFrom}
                  dayTo={dayTo}
                  setDayTo={setDayTo}
                  setChangeTab={setChangeTab}
                  isTransactionSuccess={isTransactionSuccess}
                  getTransactionHistory={getTransactionHistory}
                />
              )}
            </section>
          </div>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
};

export default Swap;
